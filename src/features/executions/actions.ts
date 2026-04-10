"use server";

import { getSubscriptionToken } from "@inngest/realtime";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { dbQueryChannel } from "@/inngest/channels/db-query";
import { discordChannel } from "@/inngest/channels/discord";
import { emailChannel } from "@/inngest/channels/email";
import { geminiChannel } from "@/inngest/channels/gemini";
import { gemmaChannel } from "@/inngest/channels/gemma";
import { googleSheetsChannel } from "@/inngest/channels/google-sheets";
import { hubspotChannel } from "@/inngest/channels/hubspot";
import { huggingFaceChannel } from "@/inngest/channels/huggingface";
import { instagramChannel } from "@/inngest/channels/instagram";
import { linkedinChannel } from "@/inngest/channels/linkedin";
import { shopifyChannel } from "@/inngest/channels/shopify";
import { slackChannel } from "@/inngest/channels/slack";
import { telegramChannel } from "@/inngest/channels/telegram";
import { twilioSmsChannel } from "@/inngest/channels/twilio-sms";
import { xChannel } from "@/inngest/channels/x";
import { inngest } from "@/inngest/client";

export async function fetchSlackRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: slackChannel(),
    topics: ["status"],
  });
}

export async function fetchDiscordRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: discordChannel(),
    topics: ["status"],
  });
}

export async function fetchGeminiRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: geminiChannel(),
    topics: ["status"],
  });
}

export async function fetchGemmaRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: gemmaChannel(),
    topics: ["status"],
  });
}

export async function fetchHuggingFaceRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: huggingFaceChannel(),
    topics: ["status"],
  });
}

export async function fetchAnthropicRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: anthropicChannel(),
    topics: ["status"],
  });
}

export async function fetchXRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: xChannel(),
    topics: ["status"],
  });
}

export async function fetchLinkedinRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: linkedinChannel(),
    topics: ["status"],
  });
}

export async function fetchInstagramRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: instagramChannel(),
    topics: ["status"],
  });
}

export async function fetchTelegramRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: telegramChannel(),
    topics: ["status"],
  });
}

export async function fetchGoogleSheetsRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: googleSheetsChannel(),
    topics: ["status"],
  });
}

export async function fetchEmailRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: emailChannel(),
    topics: ["status"],
  });
}

export async function fetchDbQueryRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: dbQueryChannel(),
    topics: ["status"],
  });
}

export async function fetchTwilioRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: twilioSmsChannel(),
    topics: ["status"],
  });
}

export async function fetchHubspotRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: hubspotChannel(),
    topics: ["status"],
  });
}

export async function fetchShopifyRealtimeToken() {
  return await getSubscriptionToken(inngest, {
    channel: shopifyChannel(),
    topics: ["status"],
  });
}
