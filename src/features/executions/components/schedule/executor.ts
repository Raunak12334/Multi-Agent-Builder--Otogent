import { z } from "zod";
import type { NodeExecutor } from "@/features/executions/types";
import { scheduleChannel } from "@/inngest/channels/schedule";

const scheduleSchema = z.object({
  variableName: z.string().min(1),
  cron: z.string().min(1),
});

type ScheduleData = z.infer<typeof scheduleSchema>;

export const scheduleExecutor: NodeExecutor<ScheduleData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    scheduleChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  const validated = scheduleSchema.parse(data);

  try {
    const result = await step.run("schedule-noop", async () => {
      return {
        success: true,
        cron: validated.cron,
        timestamp: new Date().toISOString(),
      };
    });

    await publish(
      scheduleChannel().status({
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
      scheduleChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
