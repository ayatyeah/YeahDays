-- Additive only: one new table, nothing existing is altered.
-- Daily AI limits that survive a deploy (src/lib/aiLimit.ts).
CREATE TABLE IF NOT EXISTS "AiLimit" (
  "key" TEXT NOT NULL,
  "day" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY ("key", "day")
);
CREATE INDEX IF NOT EXISTS "AiLimit_day_idx" ON "AiLimit"("day");
