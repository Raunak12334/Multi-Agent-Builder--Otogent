"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { gemmaChannel } from "@/inngest/channels/gemma";
import { inngest } from "@/inngest/client";

export type GemmaToken = Realtime.Token<typeof gemmaChannel, ["status"]>;

export async function fetchGemmaRealtimeToken(): Promise<GemmaToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: gemmaChannel(),
    topics: ["status"],
  });

  return token;
}
