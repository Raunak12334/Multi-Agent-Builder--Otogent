import { NonRetriableError } from "inngest";
import { z } from "zod";
import type { NodeExecutor } from "@/features/executions/types";
import { emailParserChannel } from "@/inngest/channels/email-parser";
import { getErrorMessage } from "@/lib/utils";

const emailParserSchema = z.object({
  variableName: z.string().min(1),
  emailContent: z.string().min(1),
});

type EmailParserData = z.infer<typeof emailParserSchema>;

export const emailParserExecutor: NodeExecutor<EmailParserData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    emailParserChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  const validated = emailParserSchema.parse(data);

  try {
    const result = await step.run("parse-email", async () => {
      const startTime = Date.now();

      // Basic regex parsing for name/phone (Simplified for demonstration)
      const nameMatch = validated.emailContent.match(/Name:\s*(.*)/i);
      const phoneMatch = validated.emailContent.match(/Phone:\s*(.*)/i);

      return {
        success: true,
        data: {
          name: nameMatch ? nameMatch[1].trim() : null,
          phone: phoneMatch ? phoneMatch[1].trim() : null,
          fullContent: validated.emailContent,
        },
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: "EMAIL_PARSER",
        },
      };
    });

    await publish(
      emailParserChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...context,
      [validated.variableName]: result,
    };
  } catch (error: unknown) {
    await publish(
      emailParserChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError(
      `Email Parser Error: ${getErrorMessage(error, "Unknown email parser error")}`,
    );
  }
};
