import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type TextTemplateData = {
  variableName?: string;
  template?: string;
};

export const textTemplateExecutor: NodeExecutor<TextTemplateData> = async ({
  data,
  context,
}) => {
  if (!data.variableName) {
    throw new NonRetriableError(
      "Text Template node: Variable name is required",
    );
  }

  if (!data.template) {
    throw new NonRetriableError("Text Template node: Template is required");
  }

  const renderedValue = Handlebars.compile(data.template)(context);

  return {
    ...context,
    [data.variableName]: renderedValue,
  };
};
