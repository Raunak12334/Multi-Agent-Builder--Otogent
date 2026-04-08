"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { huggingFaceChannel } from "@/inngest/channels/huggingface";
import { inngest } from "@/inngest/client";

export type HuggingFaceToken = Realtime.Token<
  typeof huggingFaceChannel,
  ["status"]
>;

export async function fetchHuggingFaceRealtimeToken(): Promise<HuggingFaceToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: huggingFaceChannel(),
    topics: ["status"],
  });

  return token;
}
