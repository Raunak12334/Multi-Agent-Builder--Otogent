import prisma from "@/lib/db";
import type { WorkflowGraphState } from "./types";

export const getLatestExecutionCheckpoint = async (executionId: string) => {
  return prisma.executionCheckpoint.findFirst({
    where: { executionId },
    orderBy: {
      sequence: "desc",
    },
  });
};

export const getExecutionCheckpointById = async (checkpointId: string) => {
  return prisma.executionCheckpoint.findUniqueOrThrow({
    where: { id: checkpointId },
  });
};

export const createExecutionCheckpointStore = (
  executionId: string,
  initialSequence = 0,
) => {
  let sequence = initialSequence;

  return {
    save: async (params: { nodeId?: string; state: WorkflowGraphState }) => {
      sequence += 1;

      return prisma.executionCheckpoint.create({
        data: {
          executionId,
          nodeId: params.nodeId,
          sequence,
          state: params.state as any,
        },
      });
    },
  };
};

export const updateExecutionCheckpointState = async (params: {
  checkpointId: string;
  state: WorkflowGraphState;
}) => {
  return prisma.executionCheckpoint.update({
    where: {
      id: params.checkpointId,
    },
    data: {
      state: params.state as any,
    },
  });
};
