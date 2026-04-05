import type { Realtime } from "@inngest/realtime";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import type { StepTools } from "@/features/executions/types";
import type { NodeType } from "@/generated/prisma";
import { toLegacyWorkflowContext } from "../state";
import type {
  GraphNodeExecutionParams,
  GraphNodeExecutionResult,
} from "../types";

export const executeGraphNodeWithLegacyExecutor = async (
  params: GraphNodeExecutionParams & {
    step: StepTools;
    publish: Realtime.PublishFn;
    userId: string;
  },
): Promise<GraphNodeExecutionResult> => {
  const executor = getExecutor(params.node.type as NodeType);
  const nextVariables = await executor({
    data: (params.node.data as Record<string, unknown>) ?? {},
    nodeId: params.node.id,
    userId: params.userId,
    context: toLegacyWorkflowContext(params.state),
    step: params.step,
    publish: params.publish,
  });

  return {
    state: {
      variables: nextVariables,
      lastNodeId: params.node.id,
    },
  };
};
