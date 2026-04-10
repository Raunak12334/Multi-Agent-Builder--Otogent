import { channel, topic } from "@inngest/realtime";

export const emailParserChannel = channel("email-parser-execution").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
