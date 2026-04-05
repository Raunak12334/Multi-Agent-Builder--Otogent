import type { WorkflowContext } from "@/features/executions/types";
import type { Connection, Node } from "@prisma/client";

export interface WorkflowGraphState {
  inputs: WorkflowContext;
  variables: WorkflowContext;
  messages: Array<Record<string, unknown>>;
  artifacts: WorkflowContext;
  execution: {
    workflowId: string;
    userId: string;
    inngestEventId: string;
    mode: "legacy" | "langgraph";
  };
  lastNodeId?: string;
}

export interface RuntimeWorkflowDefinition {
  workflowId: string;
  userId: string;
  nodes: Node[];
  connections: Connection[];
  orderedNodeIds: string[];
}

export interface GraphNodeExecutionParams {
  node: Node;
  state: WorkflowGraphState;
}

export interface GraphNodeExecutionResult {
  state: Partial<WorkflowGraphState>;
}
