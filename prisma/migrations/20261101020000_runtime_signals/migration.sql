CREATE TABLE "RuntimeSignal" (
  "hour" TIMESTAMP(3) NOT NULL,
  "build" TEXT NOT NULL,
  "route" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "status" INTEGER NOT NULL,
  "duration" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "RuntimeSignal_pkey" PRIMARY KEY ("hour", "build", "route", "kind", "code", "status", "duration")
);
CREATE INDEX "RuntimeSignal_hour_idx" ON "RuntimeSignal"("hour");
