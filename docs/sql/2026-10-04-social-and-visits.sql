-- Additive only: two columns with defaults and six new tables. Existing teams stay closed.
ALTER TABLE "StudyTeam" ADD COLUMN IF NOT EXISTS "open" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "StudyTeam" ADD COLUMN IF NOT EXISTS "about" TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS "Follow" (
  "followerId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "followingId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("followerId", "followingId")
);
CREATE INDEX IF NOT EXISTS "Follow_followingId_idx" ON "Follow"("followingId");

CREATE TABLE IF NOT EXISTS "SocialPost" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "parentId" TEXT REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "SocialPost_userId_createdAt_idx" ON "SocialPost"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "SocialPost_parentId_createdAt_idx" ON "SocialPost"("parentId", "createdAt");
CREATE INDEX IF NOT EXISTS "SocialPost_createdAt_idx" ON "SocialPost"("createdAt");

CREATE TABLE IF NOT EXISTS "SocialLike" (
  "postId" TEXT NOT NULL REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("postId", "userId")
);
CREATE INDEX IF NOT EXISTS "SocialLike_userId_idx" ON "SocialLike"("userId");

CREATE TABLE IF NOT EXISTS "SocialReport" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "postId" TEXT NOT NULL REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "reason" TEXT NOT NULL,
  "resolved" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "SocialReport_postId_userId_key" ON "SocialReport"("postId", "userId");
CREATE INDEX IF NOT EXISTS "SocialReport_resolved_createdAt_idx" ON "SocialReport"("resolved", "createdAt");

CREATE TABLE IF NOT EXISTS "SiteVisit" (
  "day" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "views" INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY ("day", "path")
);

CREATE TABLE IF NOT EXISTS "SiteVisitor" (
  "day" TEXT NOT NULL,
  "hash" TEXT NOT NULL,
  "authed" BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY ("day", "hash")
);
