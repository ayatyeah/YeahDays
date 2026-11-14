CREATE TABLE "FinalStudyWorkspace" (
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FinalStudyWorkspace_pkey" PRIMARY KEY ("userId")
);
ALTER TABLE "FinalStudyWorkspace" ADD CONSTRAINT "FinalStudyWorkspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
