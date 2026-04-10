import { channel, topic } from "@inngest/realtime";

export const dbQueryChannel = channel("db-query-execution").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
