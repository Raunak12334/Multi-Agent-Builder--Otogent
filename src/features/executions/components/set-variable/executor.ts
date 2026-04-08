import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type SetVariableData = {
  variableName?: string;
  valueTemplate?: string;
  parseAsJson?: boolean;
};

export const setVariableExecutor: NodeExecutor<SetVariableData> = async ({
  data,
  context,
}) => {
  if (!data.variableName) {
    throw new NonRetriableError("Set Variable node: Variable name is required");
  }

  if (!data.valueTemplate) {
    throw new NonRetriableError(
      "Set Variable node: Value template is required",
    );
  }

  const renderedValue = Handlebars.compile(data.valueTemplate)(context);
  let value: unknown = renderedValue;

  if (data.parseAsJson) {
    try {
      value = JSON.parse(renderedValue);
    } catch {
      throw new NonRetriableError(
        "Set Variable node: Parsed value is not valid JSON",
      );
    }
  }

  return {
    ...context,
    [data.variableName]: value,
  };
};
