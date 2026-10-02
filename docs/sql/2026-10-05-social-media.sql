-- Additive only: one new table and three nullable/defaulted profile columns.
ALTER TABLE "CommunityProfile" ADD COLUMN IF NOT EXISTS "hidden" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "CommunityProfile" ADD COLUMN IF NOT EXISTS "avatarId" TEXT;
ALTER TABLE "CommunityProfile" ADD COLUMN IF NOT EXISTS "noticesSeenAt" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "SocialMedia" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "postId" TEXT REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "position" INTEGER NOT NULL DEFAULT 0,
  "kind" TEXT NOT NULL DEFAULT 'post',
  "mime" TEXT NOT NULL,
  "width" INTEGER NOT NULL,
  "height" INTEGER NOT NULL,
  "bytes" INTEGER NOT NULL,
  "data" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "SocialMedia_postId_position_idx" ON "SocialMedia"("postId", "position");
CREATE INDEX IF NOT EXISTS "SocialMedia_userId_createdAt_idx" ON "SocialMedia"("userId", "createdAt");
