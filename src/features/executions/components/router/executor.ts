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

type RouterData = {
  variableName?: string;
  routeExpression?: string;
  routes?: string[];
  fallbackRoute?: string;
};

const getRoutesMap = (context: WorkflowContext): Record<string, string> => {
  const current = context.__routes;

  if (current && typeof current === "object" && !Array.isArray(current)) {
    return current as Record<string, string>;
  }

  return {};
};

export const routerExecutor: NodeExecutor<RouterData> = async ({
  data,
  nodeId,
  context,
}) => {
  if (!data.routeExpression) {
    throw new NonRetriableError("Router node: Route expression is required");
  }

  const availableRoutes = data.routes?.filter(Boolean) ?? [];

  if (availableRoutes.length === 0) {
    throw new NonRetriableError("Router node: At least one route is required");
  }

  const selectedRoute = Handlebars.compile(data.routeExpression)(
    context,
  ).trim();
  const normalizedRoute =
    availableRoutes.includes(selectedRoute) && selectedRoute
      ? selectedRoute
      : data.fallbackRoute && availableRoutes.includes(data.fallbackRoute)
        ? data.fallbackRoute
        : availableRoutes[0];

  return {
    ...context,
    __routes: {
      ...getRoutesMap(context),
      [nodeId]: normalizedRoute,
    },
    ...(data.variableName
      ? {
          [data.variableName]: {
            selectedRoute: normalizedRoute,
          },
        }
      : {}),
  };
};
