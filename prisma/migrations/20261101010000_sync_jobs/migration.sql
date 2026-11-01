ALTER TABLE "UserState" ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 1;
-- Includes old integrations and raw SQL writers, not just the browser API.
CREATE FUNCTION bump_user_state_revision() RETURNS trigger AS $$
BEGIN NEW."revision" := OLD."revision" + 1; RETURN NEW; END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER user_state_revision BEFORE UPDATE ON "UserState"
FOR EACH ROW EXECUTE FUNCTION bump_user_state_revision();
CREATE TABLE "BackgroundJob" (
  "name" TEXT PRIMARY KEY, "lastRunAt" TIMESTAMP(3) NOT NULL,
  "lastSuccessAt" TIMESTAMP(3), "lastFailureAt" TIMESTAMP(3),
  "consecutiveFailures" INTEGER NOT NULL DEFAULT 0
);
