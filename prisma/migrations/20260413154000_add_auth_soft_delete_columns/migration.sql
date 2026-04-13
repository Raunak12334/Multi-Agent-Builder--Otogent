-- Align Better Auth tables with the current Prisma schema.
-- These columns are nullable and safe to add to existing production data.
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "verification" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
