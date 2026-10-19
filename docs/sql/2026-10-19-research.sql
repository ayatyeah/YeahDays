-- Additive migration; apply before enabling the research feature.
CREATE TABLE IF NOT EXISTS "ResearchParticipant" (
  "userId" TEXT PRIMARY KEY REFERENCES "User"("id") ON DELETE CASCADE,
  "participantId" TEXT NOT NULL UNIQUE,
  "condition" TEXT NOT NULL CHECK ("condition" IN ('A', 'B')),
  "pilot" BOOLEAN NOT NULL DEFAULT FALSE,
  "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "withdrawnAt" TIMESTAMP(3),
  "data" JSONB NOT NULL
);
