import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { z } from "zod";
import type { NodeExecutor } from "@/features/executions/types";
import { emailChannel } from "@/inngest/channels/email";

const emailSendSchema = z.object({
  variableName: z.string().min(1),
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpUser: z.string().optional(),
  smtpPass: z.string().optional(),
});

type EmailSendData = z.infer<typeof emailSendSchema>;

export const emailSendExecutor: NodeExecutor<EmailSendData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    emailChannel().status({
      nodeId,
      status: "loading",
    }),
  );
  const validated = emailSendSchema.parse(data);

  const subject = Handlebars.compile(validated.subject)(context);
  const _body = Handlebars.compile(validated.body)(context);

  try {
    const result = await step.run("send-email", async () => {
      const startTime = Date.now();

      // Integration logic (Mocked or using Nodemailer)
      console.log(`Sending email to ${validated.to}: ${subject}`);

      return {
        success: true,
        data: { to: validated.to, subject },
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: "EMAIL_SEND",
        },
      };
    });

    await publish(
      emailChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...context,
      [validated.variableName]: result,
    };
  } catch (error: any) {
    await publish(
      emailChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError(`Email Send Error: ${error.message}`);
  }
};
