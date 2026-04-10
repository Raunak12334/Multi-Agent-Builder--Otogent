import { channel, topic } from "@inngest/realtime";

export const hubspotChannel = channel("hubspot-execution").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
