import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type {
  NodeExecutor,
  WorkflowContext,
} from "@/features/executions/types";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type ConditionData = {
  variableName?: string;
  expression?: string;
  trueRoute?: string;
  falseRoute?: string;
};

const getRoutesMap = (context: WorkflowContext): Record<string, string> => {
  const current = context.__routes;

  if (current && typeof current === "object" && !Array.isArray(current)) {
    return current as Record<string, string>;
  }

  return {};
};

const isTruthyValue = (value: string): boolean => {
  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return false;
  }

  if (["false", "0", "null", "undefined", "no", "off"].includes(normalized)) {
    return false;
  }

  return true;
};

export const conditionExecutor: NodeExecutor<ConditionData> = async ({
  data,
  nodeId,
  context,
}) => {
  if (!data.expression) {
    throw new NonRetriableError("Condition node: Expression is required");
  }

  const trueRoute = data.trueRoute?.trim() || "true";
  const falseRoute = data.falseRoute?.trim() || "false";
  const renderedValue = Handlebars.compile(data.expression)(context).trim();
  const result = isTruthyValue(renderedValue);
  const selectedRoute = result ? trueRoute : falseRoute;

  return {
    ...context,
    __routes: {
      ...getRoutesMap(context),
      [nodeId]: selectedRoute,
    },
    ...(data.variableName
      ? {
          [data.variableName]: {
            result,
            selectedRoute,
            value: renderedValue,
          },
        }
      : {}),
  };
};
