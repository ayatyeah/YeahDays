-- Additive deployment for an existing database managed with prisma db push.
-- Does not alter existing users, accounts, tasks or deadlines.
CREATE TABLE IF NOT EXISTS "LmsConnection" (
  "userId" TEXT NOT NULL,
  "encryptedUrl" TEXT NOT NULL,
  "timezone" TEXT NOT NULL DEFAULT 'Asia/Almaty',
  "lastSyncedAt" TIMESTAMP(3),
  "lastError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LmsConnection_pkey" PRIMARY KEY ("userId"),
  CONSTRAINT "LmsConnection_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
