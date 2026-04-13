import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { z } from "zod";
import type { NodeExecutor } from "@/features/executions/types";
import { twilioSmsChannel } from "@/inngest/channels/twilio-sms";
import { getErrorMessage } from "@/lib/utils";

const twilioSmsSchema = z.object({
  variableName: z.string().min(1),
  to: z.string().min(1),
  body: z.string().min(1),
  accountSid: z.string().min(1),
  authToken: z.string().min(1),
  from: z.string().min(1),
});

type TwilioSmsData = z.infer<typeof twilioSmsSchema>;

export const twilioSmsExecutor: NodeExecutor<TwilioSmsData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    twilioSmsChannel().status({
      nodeId,
      status: "loading",
    }),
  );
  const validated = twilioSmsSchema.parse(data);
  const body = Handlebars.compile(validated.body)(context);

  try {
    const result = await step.run("twilio-send-sms", async () => {
      const startTime = Date.now();

      console.log(`Twilio: Sending SMS to ${validated.to}: ${body}`);

      return {
        success: true,
        data: { messageSid: "SM_mock_123" },
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: "TWILIO_SMS",
        },
      };
    });

    await publish(
      twilioSmsChannel().status({
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
      twilioSmsChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError(
      `Twilio SMS Error: ${getErrorMessage(error, "Unknown Twilio SMS error")}`,
    );
  }
};
