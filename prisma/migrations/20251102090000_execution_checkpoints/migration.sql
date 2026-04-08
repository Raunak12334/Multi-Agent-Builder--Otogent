-- CreateTable
CREATE TABLE "ExecutionCheckpoint" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "nodeId" TEXT,
    "sequence" INTEGER NOT NULL,
    "state" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutionCheckpoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExecutionCheckpoint_executionId_sequence_key" ON "ExecutionCheckpoint"("executionId", "sequence");

-- CreateIndex
CREATE INDEX "ExecutionCheckpoint_executionId_createdAt_idx" ON "ExecutionCheckpoint"("executionId", "createdAt");

-- AddForeignKey
ALTER TABLE "ExecutionCheckpoint" ADD CONSTRAINT "ExecutionCheckpoint_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "Execution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
