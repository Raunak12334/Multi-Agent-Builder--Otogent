import Handlebars from "handlebars";
import type {
  NodeExecutor,
  WorkflowContext,
} from "@/features/executions/types";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type HumanApprovalData = {
  variableName?: string;
  message?: string;
};

const getApprovalsMap = (context: WorkflowContext): Record<string, boolean> => {
  const current = context.__approvals;

  if (current && typeof current === "object" && !Array.isArray(current)) {
    return current as Record<string, boolean>;
  }

  return {};
};

export const humanApprovalExecutor: NodeExecutor<HumanApprovalData> = async ({
  data,
  nodeId,
  context,
}) => {
  const approvals = getApprovalsMap(context);
  const approved = approvals[nodeId] === true;

  if (approved) {
    return {
      ...context,
      __pendingApproval: undefined,
      ...(data.variableName
        ? {
            [data.variableName]: {
              approved: true,
            },
          }
        : {}),
    };
  }

  const message = data.message
    ? Handlebars.compile(data.message)(context)
    : "Awaiting human approval.";

  return {
    ...context,
    __pendingApproval: {
      nodeId,
      message,
    },
    ...(data.variableName
      ? {
          [data.variableName]: {
            approved: false,
            message,
          },
        }
      : {}),
  };
};
