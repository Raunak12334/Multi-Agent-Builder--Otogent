import { channel, topic } from "@inngest/realtime";

export const fileStorageChannel = channel("file-storage-execution").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
