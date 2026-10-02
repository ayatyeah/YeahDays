-- Additive only: three new tables, nothing existing is altered.
CREATE TABLE IF NOT EXISTS "EventProgress" (
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "eventId" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "percent" INTEGER NOT NULL DEFAULT 0,
  "share" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("userId", "eventId")
);
CREATE INDEX IF NOT EXISTS "EventProgress_eventId_share_idx" ON "EventProgress"("eventId", "share");

CREATE TABLE IF NOT EXISTS "EventReport" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "eventId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'new',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "EventReport_status_createdAt_idx" ON "EventReport"("status", "createdAt");

CREATE TABLE IF NOT EXISTS "AiUsage" (
  "day" TEXT NOT NULL,
  "feature" TEXT NOT NULL,
  "calls" INTEGER NOT NULL DEFAULT 0,
  "inputTokens" INTEGER NOT NULL DEFAULT 0,
  "outputTokens" INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY ("day", "feature")
);
