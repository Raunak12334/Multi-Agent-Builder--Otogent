import type { Realtime } from "@inngest/realtime";
import { END, START, StateGraph } from "@langchain/langgraph";
import type { StepTools } from "@/features/executions/types";
import { topologicalSort } from "@/inngest/utils";
import prisma from "@/lib/db";
import { executeGraphNodeWithLegacyExecutor } from "./adapters/executor-node";
import { createExecutionCheckpointStore } from "./checkpoints";
import { WorkflowGraphStateAnnotation } from "./state";
import type { RuntimeWorkflowDefinition } from "./types";

const getSelectedRouteForNode = (
  variables: Record<string, unknown>,
  nodeId: string,
): string => {
  const routes = variables.__routes;

  if (!routes || typeof routes !== "object" || Array.isArray(routes)) {
    return "main";
  }

  const selectedRoute = (routes as Record<string, unknown>)[nodeId];

  return typeof selectedRoute === "string" ? selectedRoute : "main";
};

const isPendingApprovalForNode = (
  variables: Record<string, unknown>,
  nodeId: string,
): boolean => {
  const pendingApproval = variables.__pendingApproval;

  if (
    !pendingApproval ||
    typeof pendingApproval !== "object" ||
    Array.isArray(pendingApproval)
  ) {
    return false;
  }

  return (pendingApproval as Record<string, unknown>).nodeId === nodeId;
};

export const buildRuntimeWorkflowDefinition = async (params: {
  workflowId: string;
}): Promise<RuntimeWorkflowDefinition> => {
  const workflow = await prisma.workflow.findUniqueOrThrow({
    where: { id: params.workflowId },
    include: {
      nodes: true,
      connections: true,
    },
  });

  const orderedNodes = topologicalSort(workflow.nodes, workflow.connections);

  return {
    workflowId: workflow.id,
    organizationId: workflow.organizationId,
    nodes: workflow.nodes,
    connections: workflow.connections,
    orderedNodeIds: orderedNodes.map((node) => node.id),
  };
};

export const buildCompiledWorkflowGraph = (params: {
  definition: RuntimeWorkflowDefinition;
  executionId: string;
  includedNodeIds?: string[];
  initialCheckpointSequence?: number;
  startNodeIds?: string[];
  step: StepTools;
  publish: Realtime.PublishFn;
}) => {
  const includedNodeIds = new Set(
    params.includedNodeIds ?? params.definition.orderedNodeIds,
  );
  const checkpointStore = createExecutionCheckpointStore(
    params.executionId,
    params.initialCheckpointSequence,
  );
  const graph = new StateGraph<
    typeof WorkflowGraphStateAnnotation.spec,
    typeof WorkflowGraphStateAnnotation.State,
    typeof WorkflowGraphStateAnnotation.Update,
    string
  >(WorkflowGraphStateAnnotation);
  const startNodeIdSet = new Set(params.startNodeIds ?? []);

  for (const node of params.definition.nodes) {
    if (!includedNodeIds.has(node.id)) {
      continue;
    }

    graph.addNode(node.id, async (state) => {
      const result = await executeGraphNodeWithLegacyExecutor({
        node,
        state,
        step: params.step,
        publish: params.publish,
        organizationId: params.definition.organizationId,
      });

      await checkpointStore.save({
        nodeId: node.id,
        state: {
          ...state,
          ...result.state,
        },
      });

      return result.state;
    });
  }

  const incoming = new Map<string, number>();
  const outgoing = new Map<string, number>();
  const outgoingConnections = new Map<
    string,
    Array<(typeof params.definition.connections)[number]>
  >();

  for (const node of params.definition.nodes) {
    if (!includedNodeIds.has(node.id)) {
      continue;
    }

    incoming.set(node.id, 0);
    outgoing.set(node.id, 0);
  }

  for (const connection of params.definition.connections) {
    if (
      !includedNodeIds.has(connection.fromNodeId) ||
      !includedNodeIds.has(connection.toNodeId)
    ) {
      continue;
    }

    incoming.set(
      connection.toNodeId,
      (incoming.get(connection.toNodeId) ?? 0) + 1,
    );
    outgoing.set(
      connection.fromNodeId,
      (outgoing.get(connection.fromNodeId) ?? 0) + 1,
    );
    const connections = outgoingConnections.get(connection.fromNodeId) ?? [];
    connections.push(connection);
    outgoingConnections.set(connection.fromNodeId, connections);
  }

  for (const [nodeId, connections] of outgoingConnections.entries()) {
    const usesConditionalRouting =
      connections.some((connection) => connection.fromOutput !== "main") ||
      new Set(connections.map((connection) => connection.fromOutput)).size > 1;

    if (!usesConditionalRouting) {
      for (const connection of connections) {
        graph.addEdge(connection.fromNodeId, connection.toNodeId);
      }

      continue;
    }

    graph.addConditionalEdges(nodeId, (state) => {
      const selectedRoute = getSelectedRouteForNode(state.variables, nodeId);
      const matchingConnections = connections.filter(
        (connection) => connection.fromOutput === selectedRoute,
      );
      const fallbackConnections =
        matchingConnections.length > 0
          ? matchingConnections
          : connections.filter(
              (connection) =>
                connection.fromOutput === "default" ||
                connection.fromOutput === "main",
            );

      if (fallbackConnections.length === 0) {
        return END;
      }

      return fallbackConnections.map((connection) => connection.toNodeId);
    });
  }

  for (const node of params.definition.nodes) {
    if (!includedNodeIds.has(node.id) || node.type !== "HUMAN_APPROVAL") {
      continue;
    }

    graph.addConditionalEdges(node.id, (state) => {
      if (isPendingApprovalForNode(state.variables, node.id)) {
        return END;
      }

      const connections = outgoingConnections.get(node.id) ?? [];

      if (connections.length === 0) {
        return END;
      }

      return connections.map((connection) => connection.toNodeId);
    });
  }

  for (const node of params.definition.nodes) {
    if (!includedNodeIds.has(node.id)) {
      continue;
    }

    if (startNodeIdSet.size > 0) {
      if (startNodeIdSet.has(node.id)) {
        graph.addEdge(START, node.id);
      }
    } else if ((incoming.get(node.id) ?? 0) === 0) {
      graph.addEdge(START, node.id);
    }

    if ((outgoing.get(node.id) ?? 0) === 0) {
      graph.addEdge(node.id, END);
    }
  }

  return graph.compile();
};
