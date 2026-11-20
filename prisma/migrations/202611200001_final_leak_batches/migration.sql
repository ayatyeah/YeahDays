CREATE TABLE "FinalLeakBatch" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FinalLeakBatch_pkey" PRIMARY KEY ("id")
);
