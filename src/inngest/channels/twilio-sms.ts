import { channel, topic } from "@inngest/realtime";

export const twilioSmsChannel = channel("twilio-sms-execution").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
