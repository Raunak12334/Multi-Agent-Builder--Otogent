import { channel, topic } from "@inngest/realtime";

export const scheduleChannel = channel("schedule-execution").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
