import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type JsonTransformData = {
  variableName?: string;
  template?: string;
};

export const jsonTransformExecutor: NodeExecutor<JsonTransformData> = async ({
  data,
  context,
}) => {
  if (!data.variableName) {
    throw new NonRetriableError(
      "JSON Transform node: Variable name is required",
    );
  }

  if (!data.template) {
    throw new NonRetriableError("JSON Transform node: Template is required");
  }

  const renderedValue = Handlebars.compile(data.template)(context);

  try {
    return {
      ...context,
      [data.variableName]: JSON.parse(renderedValue) as unknown,
    };
  } catch {
    throw new NonRetriableError(
      "JSON Transform node: Template result is not valid JSON",
    );
  }
};
