-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('accept', 'reject', 'complete', 'skip');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "username" TEXT,
    "passwordHash" TEXT,
    "birthYear" INTEGER,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LmsConnection" (
    "userId" TEXT NOT NULL,
    "encryptedUrl" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Almaty',
    "lastSyncedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LmsConnection_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "AssistantStatus" (
    "userId" TEXT NOT NULL,
    "lastSeenAt" TIMESTAMP(3),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssistantStatus_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "AssistantEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssistantEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssistantChat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pulledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssistantChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssistantFact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssistantFact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "label" TEXT,
    "tzOffset" INTEGER NOT NULL DEFAULT 0,
    "morningHour" INTEGER NOT NULL DEFAULT 9,
    "eveningHour" INTEGER NOT NULL DEFAULT 20,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastSentAt" TIMESTAMP(3),
    "lastKind" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "fireAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "url" TEXT NOT NULL DEFAULT '/app',
    "kind" TEXT NOT NULL DEFAULT 'task',
    "taskId" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserState" (
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "clientAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserState_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordResetRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "telegram" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "category" TEXT,
    "xp" INTEGER,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "redirectUris" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKeyUser" (
    "apiKeyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKeyUser_pkey" PRIMARY KEY ("apiKeyId","userId")
);

-- CreateTable
CREATE TABLE "PairingCode" (
    "code" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "apiKeyId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PairingCode_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("userId","friendId")
);

-- CreateTable
CREATE TABLE "PublicStats" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "inviteCode" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicStats_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "SharedChallenge" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'раз',
    "target" INTEGER NOT NULL DEFAULT 1,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedChallengeMember" (
    "challengeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedChallengeMember_pkey" PRIMARY KEY ("challengeId","userId")
);

-- CreateTable
CREATE TABLE "SharedChallengeProgress" (
    "challengeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SharedChallengeProgress_pkey" PRIMARY KEY ("challengeId","userId","day")
);

-- CreateTable
CREATE TABLE "LearningProfile" (
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "PersonalizationProfile" (
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonalizationProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "AiChat" (
    "userId" TEXT NOT NULL,
    "messages" JSONB NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "pendingId" TEXT,
    "pendingAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiChat_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "CommunityProfile" (
    "userId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "bio" TEXT NOT NULL DEFAULT '',
    "subjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "goals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "blocked" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "showCharacter" BOOLEAN NOT NULL DEFAULT false,
    "showAchievements" BOOLEAN NOT NULL DEFAULT false,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "avatarId" TEXT,
    "noticesSeenAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "StudyTeam" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "invite" TEXT NOT NULL,
    "open" BOOLEAN NOT NULL DEFAULT false,
    "about" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudyTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyMember" (
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudyMember_pkey" PRIMARY KEY ("teamId","userId")
);

-- CreateTable
CREATE TABLE "StudyPost" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "roomId" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'question',
    "text" TEXT NOT NULL,
    "ai" BOOLEAN NOT NULL DEFAULT false,
    "aiPendingAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudyPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyQuest" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "target" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudyQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyRoom" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "questId" TEXT,
    "title" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyAttendance" (
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seconds" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "summary" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "StudyAttendance_pkey" PRIMARY KEY ("roomId","userId")
);

-- CreateTable
CREATE TABLE "CommunityReport" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiChatArchive" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "messages" JSONB NOT NULL,
    "messageCount" INTEGER NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiChatArchive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge30" (
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT 'null',
    "revision" INTEGER NOT NULL DEFAULT 0,
    "aiDay" TEXT NOT NULL DEFAULT '',
    "aiCount" INTEGER NOT NULL DEFAULT 0,
    "pendingId" TEXT,
    "pendingAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Challenge30_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "EventProgress" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "percent" INTEGER NOT NULL DEFAULT 0,
    "share" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventProgress_pkey" PRIMARY KEY ("userId","eventId")
);

-- CreateTable
CREATE TABLE "EventReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiLimit" (
    "key" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AiLimit_pkey" PRIMARY KEY ("key","day")
);

-- CreateTable
CREATE TABLE "AiUsage" (
    "day" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "calls" INTEGER NOT NULL DEFAULT 0,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AiUsage_pkey" PRIMARY KEY ("day","feature")
);

-- CreateTable
CREATE TABLE "Follow" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateTable
CREATE TABLE "SocialPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLike" (
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialLike_pkey" PRIMARY KEY ("postId","userId")
);

-- CreateTable
CREATE TABLE "SocialReport" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteVisit" (
    "day" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SiteVisit_pkey" PRIMARY KEY ("day","path")
);

-- CreateTable
CREATE TABLE "SiteVisitor" (
    "day" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "authed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SiteVisitor_pkey" PRIMARY KEY ("day","hash")
);

-- CreateTable
CREATE TABLE "SocialMedia" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "kind" TEXT NOT NULL DEFAULT 'post',
    "mime" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bytes" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchParticipant" (
    "userId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "pilot" BOOLEAN NOT NULL DEFAULT false,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawnAt" TIMESTAMP(3),
    "data" JSONB NOT NULL,

    CONSTRAINT "ResearchParticipant_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "TrackerMember" (
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackerMember_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "TrackerTask" (
    "number" INTEGER NOT NULL,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackerTask_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "TrackerComment" (
    "id" TEXT NOT NULL,
    "taskNumber" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackerComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackerActivity" (
    "id" TEXT NOT NULL,
    "taskNumber" INTEGER NOT NULL,
    "actor" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "fromValue" TEXT NOT NULL DEFAULT '',
    "toValue" TEXT NOT NULL DEFAULT '',
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackerActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathGoal" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "subject" TEXT NOT NULL DEFAULT '',
    "level" TEXT NOT NULL DEFAULT 'beginner',
    "language" TEXT NOT NULL DEFAULT 'ru',
    "source" TEXT NOT NULL DEFAULT '',
    "invite" TEXT NOT NULL,
    "weeklyTarget" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PathGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathMember" (
    "goalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "minutes" INTEGER NOT NULL DEFAULT 20,
    "deadline" TEXT NOT NULL DEFAULT '',
    "placementDone" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PathMember_pkey" PRIMARY KEY ("goalId","userId")
);

-- CreateTable
CREATE TABLE "PathSkill" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prerequisites" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "PathSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathUnit" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "skillIds" TEXT[],
    "title" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "sourceSpan" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'outline',
    "version" INTEGER NOT NULL DEFAULT 1,
    "startedAt" TIMESTAMP(3),

    CONSTRAINT "PathUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathQuestion" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "unitId" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'mcq',
    "stem" TEXT NOT NULL,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "answer" INTEGER NOT NULL DEFAULT -1,
    "explanation" TEXT NOT NULL DEFAULT '',
    "wrongWhy" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rubric" TEXT NOT NULL DEFAULT '',
    "level" TEXT NOT NULL DEFAULT 'medium',
    "difficulty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "answers" INTEGER NOT NULL DEFAULT 0,
    "placement" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PathQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathMastery" (
    "userId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "theta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "answers" INTEGER NOT NULL DEFAULT 0,
    "mastery" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewAt" TIMESTAMP(3),
    "reviewStep" INTEGER NOT NULL DEFAULT 0,
    "masteredAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PathMastery_pkey" PRIMARY KEY ("userId","skillId")
);

-- CreateTable
CREATE TABLE "PathLearner" (
    "userId" TEXT NOT NULL,
    "theta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "answers" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PathLearner_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "PathQuiz" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "unitId" TEXT,
    "kind" TEXT NOT NULL,
    "skillIds" TEXT[],
    "served" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "current" TEXT,
    "hints" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "PathQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathAttempt" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "answer" TEXT NOT NULL,
    "p" DOUBLE PRECISION NOT NULL,
    "thetaBefore" DOUBLE PRECISION NOT NULL,
    "thetaAfter" DOUBLE PRECISION NOT NULL,
    "bBefore" DOUBLE PRECISION NOT NULL,
    "bAfter" DOUBLE PRECISION NOT NULL,
    "hints" INTEGER NOT NULL DEFAULT 0,
    "ms" INTEGER NOT NULL DEFAULT 0,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PathAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathProgress" (
    "userId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "postponedOn" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "PathProgress_pkey" PRIMARY KEY ("userId","unitId")
);

-- CreateTable
CREATE TABLE "PathCheckIn" (
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "energy" INTEGER NOT NULL,
    "minutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PathCheckIn_pkey" PRIMARY KEY ("userId","day")
);

-- CreateTable
CREATE TABLE "PathVideo" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "unitVersion" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "script" JSONB,
    "issues" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "error" TEXT NOT NULL DEFAULT '',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "seconds" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PathVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathVideoClip" (
    "videoId" TEXT NOT NULL,
    "idx" INTEGER NOT NULL,
    "mime" TEXT NOT NULL,
    "seconds" DOUBLE PRECISION NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "PathVideoClip_pkey" PRIMARY KEY ("videoId","idx")
);

-- CreateTable
CREATE TABLE "PathEvent" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "shared" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PathEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathShare" (
    "postId" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "unitId" TEXT,
    "videoId" TEXT,
    "kind" TEXT NOT NULL,
    "invite" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "PathShare_pkey" PRIMARY KEY ("postId")
);

-- CreateTable
CREATE TABLE "PathReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PathReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "AssistantEvent_userId_createdAt_idx" ON "AssistantEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AssistantChat_userId_createdAt_idx" ON "AssistantChat"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AssistantChat_userId_role_pulledAt_idx" ON "AssistantChat"("userId", "role", "pulledAt");

-- CreateIndex
CREATE INDEX "AssistantFact_userId_createdAt_idx" ON "AssistantFact"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- CreateIndex
CREATE INDEX "PushSubscription_enabled_idx" ON "PushSubscription"("enabled");

-- CreateIndex
CREATE INDEX "ScheduledNotification_fireAt_sentAt_idx" ON "ScheduledNotification"("fireAt", "sentAt");

-- CreateIndex
CREATE INDEX "ScheduledNotification_userId_idx" ON "ScheduledNotification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledNotification_userId_key_key" ON "ScheduledNotification"("userId", "key");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "PasswordResetRequest_status_createdAt_idx" ON "PasswordResetRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Event_userId_at_idx" ON "Event"("userId", "at");

-- CreateIndex
CREATE INDEX "Event_userId_actionId_idx" ON "Event"("userId", "actionId");

-- CreateIndex
CREATE INDEX "Event_userId_type_idx" ON "Event"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_hash_key" ON "ApiKey"("hash");

-- CreateIndex
CREATE INDEX "PairingCode_userId_idx" ON "PairingCode"("userId");

-- CreateIndex
CREATE INDEX "PairingCode_apiKeyId_idx" ON "PairingCode"("apiKeyId");

-- CreateIndex
CREATE INDEX "Friendship_friendId_idx" ON "Friendship"("friendId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicStats_inviteCode_key" ON "PublicStats"("inviteCode");

-- CreateIndex
CREATE INDEX "SharedChallenge_ownerId_idx" ON "SharedChallenge"("ownerId");

-- CreateIndex
CREATE INDEX "SharedChallengeMember_userId_idx" ON "SharedChallengeMember"("userId");

-- CreateIndex
CREATE INDEX "SharedChallengeProgress_challengeId_day_idx" ON "SharedChallengeProgress"("challengeId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "StudyTeam_invite_key" ON "StudyTeam"("invite");

-- CreateIndex
CREATE INDEX "StudyMember_userId_idx" ON "StudyMember"("userId");

-- CreateIndex
CREATE INDEX "StudyPost_teamId_createdAt_idx" ON "StudyPost"("teamId", "createdAt");

-- CreateIndex
CREATE INDEX "StudyRoom_teamId_startsAt_idx" ON "StudyRoom"("teamId", "startsAt");

-- CreateIndex
CREATE INDEX "StudyAttendance_userId_idx" ON "StudyAttendance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityReport_postId_userId_key" ON "CommunityReport"("postId", "userId");

-- CreateIndex
CREATE INDEX "AiChatArchive_userId_savedAt_idx" ON "AiChatArchive"("userId", "savedAt");

-- CreateIndex
CREATE INDEX "EventProgress_eventId_share_idx" ON "EventProgress"("eventId", "share");

-- CreateIndex
CREATE INDEX "EventReport_status_createdAt_idx" ON "EventReport"("status", "createdAt");

-- CreateIndex
CREATE INDEX "AiLimit_day_idx" ON "AiLimit"("day");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

-- CreateIndex
CREATE INDEX "SocialPost_userId_createdAt_idx" ON "SocialPost"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "SocialPost_parentId_createdAt_idx" ON "SocialPost"("parentId", "createdAt");

-- CreateIndex
CREATE INDEX "SocialPost_createdAt_idx" ON "SocialPost"("createdAt");

-- CreateIndex
CREATE INDEX "SocialLike_userId_idx" ON "SocialLike"("userId");

-- CreateIndex
CREATE INDEX "SocialReport_resolved_createdAt_idx" ON "SocialReport"("resolved", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SocialReport_postId_userId_key" ON "SocialReport"("postId", "userId");

-- CreateIndex
CREATE INDEX "SocialMedia_postId_position_idx" ON "SocialMedia"("postId", "position");

-- CreateIndex
CREATE INDEX "SocialMedia_userId_createdAt_idx" ON "SocialMedia"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchParticipant_participantId_key" ON "ResearchParticipant"("participantId");

-- CreateIndex
CREATE INDEX "TrackerTask_state_idx" ON "TrackerTask"("state");

-- CreateIndex
CREATE INDEX "TrackerComment_taskNumber_createdAt_idx" ON "TrackerComment"("taskNumber", "createdAt");

-- CreateIndex
CREATE INDEX "TrackerActivity_taskNumber_at_idx" ON "TrackerActivity"("taskNumber", "at");

-- CreateIndex
CREATE UNIQUE INDEX "PathGoal_invite_key" ON "PathGoal"("invite");

-- CreateIndex
CREATE INDEX "PathGoal_ownerId_idx" ON "PathGoal"("ownerId");

-- CreateIndex
CREATE INDEX "PathMember_userId_idx" ON "PathMember"("userId");

-- CreateIndex
CREATE INDEX "PathSkill_goalId_position_idx" ON "PathSkill"("goalId", "position");

-- CreateIndex
CREATE INDEX "PathUnit_goalId_position_idx" ON "PathUnit"("goalId", "position");

-- CreateIndex
CREATE INDEX "PathQuestion_goalId_skillId_idx" ON "PathQuestion"("goalId", "skillId");

-- CreateIndex
CREATE INDEX "PathMastery_userId_goalId_idx" ON "PathMastery"("userId", "goalId");

-- CreateIndex
CREATE INDEX "PathQuiz_userId_goalId_idx" ON "PathQuiz"("userId", "goalId");

-- CreateIndex
CREATE UNIQUE INDEX "PathAttempt_key_key" ON "PathAttempt"("key");

-- CreateIndex
CREATE INDEX "PathAttempt_quizId_idx" ON "PathAttempt"("quizId");

-- CreateIndex
CREATE INDEX "PathAttempt_userId_questionId_idx" ON "PathAttempt"("userId", "questionId");

-- CreateIndex
CREATE INDEX "PathProgress_goalId_completedAt_idx" ON "PathProgress"("goalId", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PathVideo_unitId_unitVersion_language_key" ON "PathVideo"("unitId", "unitVersion", "language");

-- CreateIndex
CREATE INDEX "PathEvent_goalId_createdAt_idx" ON "PathEvent"("goalId", "createdAt");

-- CreateIndex
CREATE INDEX "PathReport_goalId_resolved_idx" ON "PathReport"("goalId", "resolved");

-- CreateIndex
CREATE UNIQUE INDEX "PathReport_userId_target_targetId_key" ON "PathReport"("userId", "target", "targetId");

-- AddForeignKey
ALTER TABLE "LmsConnection" ADD CONSTRAINT "LmsConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistantStatus" ADD CONSTRAINT "AssistantStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistantEvent" ADD CONSTRAINT "AssistantEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistantChat" ADD CONSTRAINT "AssistantChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistantFact" ADD CONSTRAINT "AssistantFact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledNotification" ADD CONSTRAINT "ScheduledNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserState" ADD CONSTRAINT "UserState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKeyUser" ADD CONSTRAINT "ApiKeyUser_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKeyUser" ADD CONSTRAINT "ApiKeyUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairingCode" ADD CONSTRAINT "PairingCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairingCode" ADD CONSTRAINT "PairingCode_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicStats" ADD CONSTRAINT "PublicStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedChallenge" ADD CONSTRAINT "SharedChallenge_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedChallengeMember" ADD CONSTRAINT "SharedChallengeMember_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "SharedChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedChallengeMember" ADD CONSTRAINT "SharedChallengeMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedChallengeProgress" ADD CONSTRAINT "SharedChallengeProgress_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "SharedChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedChallengeProgress" ADD CONSTRAINT "SharedChallengeProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProfile" ADD CONSTRAINT "LearningProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalizationProfile" ADD CONSTRAINT "PersonalizationProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AiChat" ADD CONSTRAINT "AiChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityProfile" ADD CONSTRAINT "CommunityProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyTeam" ADD CONSTRAINT "StudyTeam_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyMember" ADD CONSTRAINT "StudyMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "StudyTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyMember" ADD CONSTRAINT "StudyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyPost" ADD CONSTRAINT "StudyPost_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "StudyTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyPost" ADD CONSTRAINT "StudyPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyPost" ADD CONSTRAINT "StudyPost_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "StudyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyPost" ADD CONSTRAINT "StudyPost_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "StudyRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyQuest" ADD CONSTRAINT "StudyQuest_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "StudyTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoom" ADD CONSTRAINT "StudyRoom_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "StudyTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyRoom" ADD CONSTRAINT "StudyRoom_questId_fkey" FOREIGN KEY ("questId") REFERENCES "StudyQuest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyAttendance" ADD CONSTRAINT "StudyAttendance_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "StudyRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyAttendance" ADD CONSTRAINT "StudyAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityReport" ADD CONSTRAINT "CommunityReport_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "StudyTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityReport" ADD CONSTRAINT "CommunityReport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "StudyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityReport" ADD CONSTRAINT "CommunityReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiChatArchive" ADD CONSTRAINT "AiChatArchive_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge30" ADD CONSTRAINT "Challenge30_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProgress" ADD CONSTRAINT "EventProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventReport" ADD CONSTRAINT "EventReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPost" ADD CONSTRAINT "SocialPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPost" ADD CONSTRAINT "SocialPost_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLike" ADD CONSTRAINT "SocialLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLike" ADD CONSTRAINT "SocialLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialReport" ADD CONSTRAINT "SocialReport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialReport" ADD CONSTRAINT "SocialReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMedia" ADD CONSTRAINT "SocialMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMedia" ADD CONSTRAINT "SocialMedia_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchParticipant" ADD CONSTRAINT "ResearchParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TrackerComment" ADD CONSTRAINT "TrackerComment_taskNumber_fkey" FOREIGN KEY ("taskNumber") REFERENCES "TrackerTask"("number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackerActivity" ADD CONSTRAINT "TrackerActivity_taskNumber_fkey" FOREIGN KEY ("taskNumber") REFERENCES "TrackerTask"("number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathGoal" ADD CONSTRAINT "PathGoal_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathMember" ADD CONSTRAINT "PathMember_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "PathGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathMember" ADD CONSTRAINT "PathMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathSkill" ADD CONSTRAINT "PathSkill_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "PathGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathUnit" ADD CONSTRAINT "PathUnit_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "PathGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathQuestion" ADD CONSTRAINT "PathQuestion_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "PathGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathMastery" ADD CONSTRAINT "PathMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathMastery" ADD CONSTRAINT "PathMastery_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "PathSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathLearner" ADD CONSTRAINT "PathLearner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathQuiz" ADD CONSTRAINT "PathQuiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathQuiz" ADD CONSTRAINT "PathQuiz_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "PathGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathAttempt" ADD CONSTRAINT "PathAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "PathQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathProgress" ADD CONSTRAINT "PathProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathProgress" ADD CONSTRAINT "PathProgress_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "PathUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathCheckIn" ADD CONSTRAINT "PathCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathVideo" ADD CONSTRAINT "PathVideo_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "PathUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathVideoClip" ADD CONSTRAINT "PathVideoClip_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "PathVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathEvent" ADD CONSTRAINT "PathEvent_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "PathGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathEvent" ADD CONSTRAINT "PathEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathShare" ADD CONSTRAINT "PathShare_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathShare" ADD CONSTRAINT "PathShare_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "PathGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathReport" ADD CONSTRAINT "PathReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathReport" ADD CONSTRAINT "PathReport_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "PathGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
