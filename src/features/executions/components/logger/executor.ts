import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type LoggerData = {
  level?: "info" | "warn" | "error";
  message?: string;
  variableName?: string;
};

export const loggerExecutor: NodeExecutor<LoggerData> = async ({
  data,
  context,
}) => {
  if (!data.message) {
    throw new NonRetriableError("Logger node: Message is required");
  }

  const renderedMessage = Handlebars.compile(data.message)(context);
  const level = data.level || "info";

  if (level === "warn") {
    console.warn(`[Workflow Logger] ${renderedMessage}`);
  } else if (level === "error") {
    console.error(`[Workflow Logger] ${renderedMessage}`);
  } else {
    console.info(`[Workflow Logger] ${renderedMessage}`);
  }

  if (!data.variableName) {
    return context;
  }

  return {
    ...context,
    [data.variableName]: {
      level,
      message: renderedMessage,
      loggedAt: new Date().toISOString(),
    },
  };
};
