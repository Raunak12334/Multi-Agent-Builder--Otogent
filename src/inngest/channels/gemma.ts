import { channel, topic } from "@inngest/realtime";

export const GEMMA_CHANNEL_NAME = "gemma-execution";

export const gemmaChannel = channel(GEMMA_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
