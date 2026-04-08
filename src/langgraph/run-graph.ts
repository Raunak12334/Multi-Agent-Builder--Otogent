import type { Realtime } from "@inngest/realtime";
import type { StepTools } from "@/features/executions/types";
import { resolveWorkflowStartNodeIds } from "@/features/workflows/lib/start-nodes";
import {
  buildCompiledWorkflowGraph,
  buildRuntimeWorkflowDefinition,
} from "./build-graph";
import {
  getExecutionCheckpointById,
  getLatestExecutionCheckpoint,
} from "./checkpoints";
import {
  createInitialWorkflowGraphState,
  toLegacyWorkflowContext,
} from "./state";
import type { WorkflowGraphState } from "./types";

const getRemainingNodeIds = (orderedNodeIds: string[], lastNodeId?: string) => {
  if (!lastNodeId) {
    return orderedNodeIds;
  }

  const lastNodeIndex = orderedNodeIds.indexOf(lastNodeId);

  if (lastNodeIndex === -1) {
    return orderedNodeIds;
  }

  return orderedNodeIds.slice(lastNodeIndex + 1);
};

export const runWorkflowGraph = async (params: {
  executionId: string;
  workflowId: string;
  organizationId: string;
  inngestEventId: string;
  checkpointId?: string;
  triggerNodeId?: string;
  initialData?: Record<string, unknown>;
  step: StepTools;
  publish: Realtime.PublishFn;
}) => {
  const definition = await buildRuntimeWorkflowDefinition({
    workflowId: params.workflowId,
  });
  const checkpointRecord = params.checkpointId
    ? await getExecutionCheckpointById(params.checkpointId)
    : await getLatestExecutionCheckpoint(params.executionId);
  const resumedState = checkpointRecord?.state as
    | WorkflowGraphState
    | undefined;
  const initialState =
    resumedState ??
    createInitialWorkflowGraphState({
      workflowId: params.workflowId,
      organizationId: params.organizationId,
      inngestEventId: params.inngestEventId,
      initialData: params.initialData,
      mode: "langgraph",
    });
  const remainingNodeIds = getRemainingNodeIds(
    definition.orderedNodeIds,
    resumedState?.lastNodeId,
  );
  const startNodeIds = resumedState
    ? undefined
    : resolveWorkflowStartNodeIds({
        nodes: definition.nodes,
        triggerNodeId: params.triggerNodeId,
      });

  if (remainingNodeIds.length === 0) {
    return {
      definition,
      state: initialState,
      output: toLegacyWorkflowContext(initialState),
    };
  }

  const graph = buildCompiledWorkflowGraph({
    definition,
    executionId: params.executionId,
    includedNodeIds: remainingNodeIds,
    initialCheckpointSequence: params.checkpointId
      ? 0
      : (checkpointRecord?.sequence ?? 0),
    startNodeIds,
    step: params.step,
    publish: params.publish,
  });
  const state = await graph.invoke(initialState);

  return {
    definition,
    state,
    output: toLegacyWorkflowContext(state),
    awaitingApproval:
      Boolean(
        state.variables.__pendingApproval &&
          typeof state.variables.__pendingApproval === "object",
      ) && !params.checkpointId,
  };
};
