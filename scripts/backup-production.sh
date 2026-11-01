#!/usr/bin/env bash
set -euo pipefail
umask 077
: "${BACKUP_DATABASE_URL:?Source database is required}"
: "${BACKUP_PASSPHRASE:?Encryption passphrase is required}"
: "${RESTORE_HOST:?Separate restore host is required}"
: "${RESTORE_USER:?Separate restore user is required}"
: "${RESTORE_PASSWORD:?Separate restore password is required}"
# Restore target is deliberately restricted to the CI service or a local socket.
case "$RESTORE_HOST" in restore|localhost|127.0.0.1|/var/run/postgresql) ;; *) exit 2 ;; esac
work=$(mktemp -d)
name="yg_backup_verify_$(date +%s)_${RANDOM}"
created=0
cleanup() {
  if [ "$created" = 1 ]; then PGPASSWORD="$RESTORE_PASSWORD" dropdb -h "$RESTORE_HOST" -U "$RESTORE_USER" --if-exists "$name"; fi
  rm -rf "$work"
}
trap cleanup EXIT
out="${BACKUP_OUTPUT_DIR:-artifacts/backup}"
mkdir -p "$out"
stamp=$(date -u +%Y%m%dT%H%M%SZ)
file="$out/yeahgrind-$stamp.dump.gpg"
pg_dump "$BACKUP_DATABASE_URL" --format=custom --no-owner --no-acl --file="$work/source.dump"
printf '%s' "$BACKUP_PASSPHRASE" | gpg --batch --yes --pinentry-mode loopback --passphrase-fd 0 --symmetric --cipher-algo AES256 --output "$file" "$work/source.dump"
printf '%s' "$BACKUP_PASSPHRASE" | gpg --batch --yes --pinentry-mode loopback --passphrase-fd 0 --output "$work/restored.dump" --decrypt "$file"
cmp "$work/source.dump" "$work/restored.dump"
export PGPASSWORD="$RESTORE_PASSWORD"
createdb -h "$RESTORE_HOST" -U "$RESTORE_USER" "$name"
created=1
pg_restore -h "$RESTORE_HOST" -U "$RESTORE_USER" --dbname="$name" --exit-on-error --no-owner --no-acl "$work/restored.dump"
psql -X -h "$RESTORE_HOST" -U "$RESTORE_USER" -d "$name" -v ON_ERROR_STOP=1 <<'SQL'
BEGIN;
DO $$
DECLARE target text; before_revision integer; after_revision integer;
BEGIN
  IF to_regclass('public."User"') IS NULL OR to_regclass('public."UserState"') IS NULL
     OR to_regclass('public."LearningProfile"') IS NULL OR to_regclass('public."ResearchParticipant"') IS NULL THEN
    RAISE EXCEPTION 'Required application tables are missing';
  END IF;
  IF EXISTS (SELECT 1 FROM "UserState" s LEFT JOIN "User" u ON u.id=s."userId" WHERE u.id IS NULL) THEN
    RAISE EXCEPTION 'Orphan state rows';
  END IF;
  SELECT "userId", revision INTO target, before_revision FROM "UserState" LIMIT 1;
  IF target IS NOT NULL THEN
    UPDATE "UserState" SET data=data WHERE "userId"=target;
    SELECT revision INTO after_revision FROM "UserState" WHERE "userId"=target;
    IF after_revision <> before_revision+1 THEN RAISE EXCEPTION 'Revision trigger missing'; END IF;
  END IF;
END $$;
ROLLBACK;
SQL
(cd "$out" && sha256sum "$(basename "$file")" > "$(basename "$file").sha256")
printf '{"createdAt":"%s","decrypted":true,"restored":true,"schemaAndRevisionChecked":true}\n' "$stamp" > "$out/verification.json"
echo "PASS: encrypted backup decrypted and restored into an isolated database"
