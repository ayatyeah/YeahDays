-- Additive migration: team task tracker (/team). Creates four new tables, changes nothing existing.
CREATE TABLE IF NOT EXISTS "TrackerMember" (
  "email" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "TrackerTask" (
  "number" INTEGER PRIMARY KEY,
  "summary" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "epic" TEXT NOT NULL DEFAULT '',
  "type" TEXT NOT NULL DEFAULT 'Task',
  "priority" TEXT NOT NULL DEFAULT 'Normal',
  "state" TEXT NOT NULL DEFAULT 'Open',
  "assignee" TEXT NOT NULL DEFAULT '',
  "reviewer" TEXT NOT NULL DEFAULT '',
  "estimate" TEXT NOT NULL DEFAULT '',
  "sprint" TEXT NOT NULL DEFAULT '',
  "dueDate" TEXT NOT NULL DEFAULT '',
  "requirements" TEXT NOT NULL DEFAULT '',
  "acceptance" TEXT NOT NULL DEFAULT '',
  "dependsOn" TEXT NOT NULL DEFAULT '',
  "links" TEXT NOT NULL DEFAULT '',
  "createdBy" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX IF NOT EXISTS "TrackerTask_state_idx" ON "TrackerTask"("state");
CREATE TABLE IF NOT EXISTS "TrackerComment" (
  "id" TEXT PRIMARY KEY,
  "taskNumber" INTEGER NOT NULL REFERENCES "TrackerTask"("number") ON DELETE CASCADE ON UPDATE CASCADE,
  "author" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "TrackerComment_taskNumber_createdAt_idx" ON "TrackerComment"("taskNumber", "createdAt");
CREATE TABLE IF NOT EXISTS "TrackerActivity" (
  "id" TEXT PRIMARY KEY,
  "taskNumber" INTEGER NOT NULL REFERENCES "TrackerTask"("number") ON DELETE CASCADE ON UPDATE CASCADE,
  "actor" TEXT NOT NULL,
  "field" TEXT NOT NULL,
  "fromValue" TEXT NOT NULL DEFAULT '',
  "toValue" TEXT NOT NULL DEFAULT '',
  "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "TrackerActivity_taskNumber_at_idx" ON "TrackerActivity"("taskNumber", "at");
