import { z } from "zod";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";

const emailParserSchema = z.object({
  variableName: z.string().min(1),
  emailContent: z.string().min(1),
});

type EmailParserData = z.infer<typeof emailParserSchema>;

export const emailParserExecutor: NodeExecutor<EmailParserData> = async ({
  data,
  context,
  step,
}) => {
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
          fullContent: validated.emailContent
        },
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: "EMAIL_PARSER",
        }
      };
    });

    return {
      ...context,
      [validated.variableName]: result,
    };
  } catch (error: any) {
    throw new NonRetriableError(`Email Parser Error: ${error.message}`);
  }
};
