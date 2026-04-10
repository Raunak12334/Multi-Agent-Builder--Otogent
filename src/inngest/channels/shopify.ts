import { channel, topic } from "@inngest/realtime";

export const shopifyChannel = channel("shopify-execution").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
