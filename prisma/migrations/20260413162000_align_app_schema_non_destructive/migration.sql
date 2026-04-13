-- Bring production in line with the current Prisma models without dropping
-- legacy capitalized tables that may still contain user data.

DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "QueueStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "NodeStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'RETRIED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TYPE "NodeType" ADD VALUE IF NOT EXISTS 'X';
ALTER TYPE "NodeType" ADD VALUE IF NOT EXISTS 'LINKEDIN';
ALTER TYPE "NodeType" ADD VALUE IF NOT EXISTS 'INSTAGRAM';
ALTER TYPE "NodeType" ADD VALUE IF NOT EXISTS 'TELEGRAM';
ALTER TYPE "NodeType" ADD VALUE IF NOT EXISTS 'GOOGLE_SHEETS';
ALTER TYPE "NodeType" ADD VALUE IF NOT EXISTS 'EMAIL_SEND';
ALTER TYPE "NodeType" ADD VALUE IF NOT EXISTS 'EMAIL_PARSER';
ALTER TYPE "NodeType" ADD VALUE IF NOT EXISTS 'SCHEDULE';
ALTER TYPE "NodeType" ADD VALUE IF NOT EXISTS 'DB_QUERY';
ALTER TYPE "NodeType" ADD VALUE IF NOT EXISTS 'FILE_STORAGE';
ALTER TYPE "NodeType" ADD VALUE IF NOT EXISTS 'TWILIO_SMS';
ALTER TYPE "NodeType" ADD VALUE IF NOT EXISTS 'HUBSPOT';
ALTER TYPE "NodeType" ADD VALUE IF NOT EXISTS 'SHOPIFY';

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" "Role" NOT NULL DEFAULT 'USER';
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;

CREATE TABLE IF NOT EXISTS "organization" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "companySize" TEXT,
  "useCase" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "subscription" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "plan" "Plan" NOT NULL DEFAULT 'FREE',
  "freeTierStartedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "team_invite" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "invitedById" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "used" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "team_invite_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "organizationId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "credential" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "value" TEXT,
  "type" "CredentialType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  "organizationId" TEXT NOT NULL,
  "accessLevel" TEXT,
  "expiresAt" TIMESTAMP(3),
  "lastUsedAt" TIMESTAMP(3),
  "rotationCount" INTEGER NOT NULL DEFAULT 0,
  "accessRoles" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "lastRotatedAt" TIMESTAMP(3),
  "valueEncrypted" TEXT,
  CONSTRAINT "credential_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "workflow" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  "organizationId" TEXT NOT NULL,
  "currentVersion" INTEGER NOT NULL DEFAULT 1,
  "isLocked" BOOLEAN NOT NULL DEFAULT false,
  "webhookSecret" TEXT,
  CONSTRAINT "workflow_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "workflow_version" (
  "id" TEXT NOT NULL,
  "workflowId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "nodes" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "connections" JSONB NOT NULL,
  "deprecatedAt" TIMESTAMP(3),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "workflow_version_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "node" (
  "id" TEXT NOT NULL,
  "workflowId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "NodeType" NOT NULL,
  "position" JSONB NOT NULL,
  "data" JSONB NOT NULL DEFAULT '{}',
  "credentialId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  "config" JSONB,
  "delayMs" INTEGER,
  "prompt" TEXT,
  "url" TEXT,
  CONSTRAINT "node_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "connection" (
  "id" TEXT NOT NULL,
  "workflowId" TEXT NOT NULL,
  "fromNodeId" TEXT NOT NULL,
  "toNodeId" TEXT NOT NULL,
  "fromOutput" TEXT NOT NULL DEFAULT 'main',
  "toInput" TEXT NOT NULL DEFAULT 'main',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "connection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "execution" (
  "id" TEXT NOT NULL,
  "workflowId" TEXT NOT NULL,
  "status" "ExecutionStatus" NOT NULL DEFAULT 'RUNNING',
  "error" TEXT,
  "errorStack" TEXT,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  "inngestEventId" TEXT NOT NULL,
  "deletedAt" TIMESTAMP(3),
  "output" JSONB,
  "archivedAt" TIMESTAMP(3),
  "idempotencyKey" TEXT,
  "maxRetries" INTEGER NOT NULL DEFAULT 3,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "versionUsed" INTEGER,
  "lastRetryAt" TIMESTAMP(3),
  "priority" INTEGER NOT NULL DEFAULT 0,
  "queueStatus" "QueueStatus" NOT NULL DEFAULT 'QUEUED',
  "retryStrategy" TEXT NOT NULL DEFAULT 'exponential',
  "scheduledAt" TIMESTAMP(3),
  CONSTRAINT "execution_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "execution_checkpoint" (
  "id" TEXT NOT NULL,
  "executionId" TEXT NOT NULL,
  "nodeId" TEXT,
  "sequence" INTEGER NOT NULL,
  "state" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  "archivedAt" TIMESTAMP(3),
  "error" TEXT,
  "nodeType" "NodeType",
  "durationMs" INTEGER,
  "nodeExecutionId" TEXT,
  "retryAttempt" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "execution_checkpoint_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "node_execution" (
  "id" TEXT NOT NULL,
  "executionId" TEXT NOT NULL,
  "nodeId" TEXT NOT NULL,
  "status" "NodeStatus" NOT NULL DEFAULT 'PENDING',
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "error" TEXT,
  "output" JSONB,
  "archivedAt" TIMESTAMP(3),
  "attempt" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "node_execution_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "rate_limit_bucket" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "limitType" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 0,
  "limit" INTEGER NOT NULL,
  "resetAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "rate_limit_bucket_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "execution_audit_log" (
  "id" TEXT NOT NULL,
  "executionId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "details" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  "archivedAt" TIMESTAMP(3),
  CONSTRAINT "execution_audit_log_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "support_ticket" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "organizationId" TEXT,
  "subject" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
  "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "support_ticket_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "subscription_organizationId_key" ON "subscription"("organizationId");
CREATE UNIQUE INDEX IF NOT EXISTS "team_invite_tokenHash_key" ON "team_invite"("tokenHash");
CREATE UNIQUE INDEX IF NOT EXISTS "team_invite_email_organizationId_key" ON "team_invite"("email", "organizationId");
CREATE INDEX IF NOT EXISTS "AuditLog_organizationId_createdAt_idx" ON "AuditLog"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "credential_organizationId_type_idx" ON "credential"("organizationId", "type");
CREATE UNIQUE INDEX IF NOT EXISTS "workflow_webhookSecret_key" ON "workflow"("webhookSecret");
CREATE INDEX IF NOT EXISTS "workflow_organizationId_updatedAt_idx" ON "workflow"("organizationId", "updatedAt");
CREATE INDEX IF NOT EXISTS "workflow_version_workflowId_idx" ON "workflow_version"("workflowId");
CREATE UNIQUE INDEX IF NOT EXISTS "workflow_version_workflowId_version_key" ON "workflow_version"("workflowId", "version");
CREATE INDEX IF NOT EXISTS "node_workflowId_type_idx" ON "node"("workflowId", "type");
CREATE INDEX IF NOT EXISTS "node_credentialId_idx" ON "node"("credentialId");
CREATE UNIQUE INDEX IF NOT EXISTS "connection_fromNodeId_toNodeId_fromOutput_toInput_key" ON "connection"("fromNodeId", "toNodeId", "fromOutput", "toInput");
CREATE INDEX IF NOT EXISTS "execution_workflowId_status_startedAt_idx" ON "execution"("workflowId", "status", "startedAt");
CREATE INDEX IF NOT EXISTS "execution_status_queueStatus_scheduledAt_idx" ON "execution"("status", "queueStatus", "scheduledAt");
CREATE INDEX IF NOT EXISTS "execution_workflowId_startedAt_idx" ON "execution"("workflowId", "startedAt");
CREATE INDEX IF NOT EXISTS "execution_queueStatus_priority_scheduledAt_idx" ON "execution"("queueStatus", "priority", "scheduledAt");
CREATE INDEX IF NOT EXISTS "execution_status_retryCount_idx" ON "execution"("status", "retryCount");
CREATE INDEX IF NOT EXISTS "execution_inngestEventId_idx" ON "execution"("inngestEventId");
CREATE INDEX IF NOT EXISTS "execution_idempotencyKey_idx" ON "execution"("idempotencyKey");
CREATE INDEX IF NOT EXISTS "execution_checkpoint_executionId_createdAt_idx" ON "execution_checkpoint"("executionId", "createdAt");
CREATE INDEX IF NOT EXISTS "execution_checkpoint_executionId_nodeId_sequence_idx" ON "execution_checkpoint"("executionId", "nodeId", "sequence");
CREATE INDEX IF NOT EXISTS "execution_checkpoint_nodeExecutionId_idx" ON "execution_checkpoint"("nodeExecutionId");
CREATE UNIQUE INDEX IF NOT EXISTS "execution_checkpoint_executionId_sequence_key" ON "execution_checkpoint"("executionId", "sequence");
CREATE INDEX IF NOT EXISTS "node_execution_executionId_status_idx" ON "node_execution"("executionId", "status");
CREATE INDEX IF NOT EXISTS "node_execution_executionId_nodeId_idx" ON "node_execution"("executionId", "nodeId");
CREATE INDEX IF NOT EXISTS "node_execution_nodeId_startedAt_idx" ON "node_execution"("nodeId", "startedAt");
CREATE INDEX IF NOT EXISTS "node_execution_executionId_startedAt_idx" ON "node_execution"("executionId", "startedAt");
CREATE INDEX IF NOT EXISTS "node_execution_status_retryCount_idx" ON "node_execution"("status", "retryCount");
CREATE INDEX IF NOT EXISTS "node_execution_executionId_attempt_idx" ON "node_execution"("executionId", "attempt");
CREATE UNIQUE INDEX IF NOT EXISTS "node_execution_executionId_nodeId_attempt_key" ON "node_execution"("executionId", "nodeId", "attempt");
CREATE INDEX IF NOT EXISTS "rate_limit_bucket_organizationId_limitType_idx" ON "rate_limit_bucket"("organizationId", "limitType");
CREATE UNIQUE INDEX IF NOT EXISTS "rate_limit_bucket_organizationId_limitType_resetAt_key" ON "rate_limit_bucket"("organizationId", "limitType", "resetAt");
CREATE INDEX IF NOT EXISTS "execution_audit_log_executionId_idx" ON "execution_audit_log"("executionId");
CREATE INDEX IF NOT EXISTS "execution_audit_log_organizationId_createdAt_idx" ON "execution_audit_log"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "execution_audit_log_executionId_createdAt_idx" ON "execution_audit_log"("executionId", "createdAt");
CREATE INDEX IF NOT EXISTS "support_ticket_userId_idx" ON "support_ticket"("userId");
CREATE INDEX IF NOT EXISTS "support_ticket_status_idx" ON "support_ticket"("status");
CREATE INDEX IF NOT EXISTS "user_organizationId_idx" ON "user"("organizationId");
