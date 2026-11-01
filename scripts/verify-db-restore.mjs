/** Disposable database rehearsal. Never dumps or mutates the configured DB. */
import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const configured = new URL(process.env.DATABASE_URL || '');
const host = configured.searchParams.get('host') || configured.hostname;
if (!['localhost', '127.0.0.1', '/var/run/postgresql'].includes(host)) throw new Error('Restore rehearsal requires local PostgreSQL');
const prefix = `yg_restore_test_${randomUUID().replaceAll("-", "").slice(0, 16)}`;
const source = `${prefix}_source`, target = `${prefix}_target`;
const created = [];
const folder = mkdtempSync(join(tmpdir(), 'yg-restore-'));
const dbEnv = name => ({ ...process.env, PGHOST: host, PGPORT: configured.port || '5432', PGUSER: decodeURIComponent(configured.username), PGPASSWORD: decodeURIComponent(configured.password), PGDATABASE: name });
const run = (command, args, name = 'postgres') => execFileSync(command, args, { env: dbEnv(name), encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
const sql = (name, text) => run('psql', ['-X', '-v', 'ON_ERROR_STOP=1', '-Atc', text], name).trim();
try {
  run('createdb', [source]); created.push(source);
  run('createdb', [target]); created.push(target);
  const url = new URL(configured); url.pathname = `/${source}`;
  execFileSync('npx', ['prisma', 'migrate', 'deploy'], { env: { ...process.env, DATABASE_URL: url.toString() }, stdio: 'pipe' });
  sql(source, `INSERT INTO "User" ("id", "updatedAt") VALUES ('restore-fixture', now());
    INSERT INTO "UserState" ("userId", "data", "clientAt", "updatedAt") VALUES ('restore-fixture', '{"todos":[{"id":"one","done":true}]}', now(), now());
    UPDATE "UserState" SET "data" = "data" WHERE "userId" = 'restore-fixture';`);
  if (sql(source, 'SELECT revision FROM "UserState"') !== '2') throw new Error('Revision trigger failed');
  const archive = join(folder, 'fixture.dump');
  run('pg_dump', ['-Fc', '--no-owner', '--no-acl', '-f', archive], source);
  run('pg_restore', ['--exit-on-error', '--no-owner', '--no-acl', '-d', target, archive], target);
  const fingerprint = `SELECT md5(string_agg(row_to_json(t)::text, ',' ORDER BY "userId")) FROM "UserState" t`;
  if (sql(source, fingerprint) !== sql(target, fingerprint)) throw new Error('Restored data differs');
  sql(target, 'UPDATE "UserState" SET "data" = "data"');
  if (sql(target, 'SELECT revision FROM "UserState"') !== '3') throw new Error('Restored trigger failed');
  console.log('PASS: fresh migrations, fixture backup/restore, data fingerprint and revision trigger');
} finally {
  for (const name of created) run('dropdb', ['--if-exists', name]);
  rmSync(folder, { recursive: true, force: true });
}
