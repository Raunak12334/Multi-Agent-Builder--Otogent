import { Annotation } from "@langchain/langgraph";
import type { WorkflowContext } from "@/features/executions/types";
import type { WorkflowGraphState } from "./types";

const mergeRecord = (
  left: WorkflowContext,
  right: WorkflowContext | undefined,
): WorkflowContext => ({
  ...left,
  ...(right ?? {}),
});

export const WorkflowGraphStateAnnotation = Annotation.Root({
  inputs: Annotation<WorkflowContext>({
    reducer: mergeRecord,
    default: () => ({}),
  }),
  variables: Annotation<WorkflowContext>({
    reducer: mergeRecord,
    default: () => ({}),
  }),
  messages: Annotation<Array<Record<string, unknown>>>({
    reducer: (
      left: Array<Record<string, unknown>>,
      right: Array<Record<string, unknown>> | undefined,
    ) => left.concat(right ?? []),
    default: () => [],
  }),
  artifacts: Annotation<WorkflowContext>({
    reducer: mergeRecord,
    default: () => ({}),
  }),
  execution: Annotation<WorkflowGraphState["execution"]>(),
  lastNodeId: Annotation<string | undefined>(),
});

export const createInitialWorkflowGraphState = (params: {
  workflowId: string;
  organizationId: string;
  inngestEventId: string;
  initialData?: WorkflowContext;
  mode: "legacy" | "langgraph";
}): WorkflowGraphState => ({
  inputs: params.initialData ?? {},
  variables: params.initialData ?? {},
  messages: [],
  artifacts: {},
  execution: {
    workflowId: params.workflowId,
    organizationId: params.organizationId,
    inngestEventId: params.inngestEventId,
    mode: params.mode,
  },
  lastNodeId: undefined,
});

export const toLegacyWorkflowContext = (
  state: WorkflowGraphState,
): WorkflowContext => ({
  ...state.inputs,
  ...state.variables,
  ...state.artifacts,
});
