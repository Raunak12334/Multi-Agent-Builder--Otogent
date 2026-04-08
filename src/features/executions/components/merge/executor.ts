import type { NodeExecutor } from "@/features/executions/types";

type MergeData = Record<string, unknown>;

export const mergeExecutor: NodeExecutor<MergeData> = async ({ context }) => {
  return context;
};
