import { z } from "zod";
import type { NodeExecutor } from "@/features/executions/types";

const scheduleSchema = z.object({
  variableName: z.string().min(1),
  cron: z.string().min(1),
});

type ScheduleData = z.infer<typeof scheduleSchema>;

export const scheduleExecutor: NodeExecutor<ScheduleData> = async ({
  data,
  context,
  step,
}) => {
  const validated = scheduleSchema.parse(data);

  return await step.run("schedule-noop", async () => {
    return {
      ...context,
      [validated.variableName]: {
        success: true,
        cron: validated.cron,
        timestamp: new Date().toISOString()
      }
    };
  });
};
