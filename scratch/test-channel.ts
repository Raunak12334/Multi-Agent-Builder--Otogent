import { channel, topic } from "@inngest/realtime";

const testChannel = channel("test").addTopic(topic("status").type<{ node: string }>());

console.log("Type of testChannel:", typeof testChannel);
if (typeof testChannel === "function") {
  console.log("testChannel is a function!");
}
