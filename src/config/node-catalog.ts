import { NodeType } from "@prisma/client";
import {
  BotMessageSquareIcon,
  BracesIcon,
  BrainCircuitIcon,
  Clock3Icon,
  FileTextIcon,
  GitBranchPlusIcon,
  GitForkIcon,
  GitMergeIcon,
  GlobeIcon,
  MessageSquareShareIcon,
  MousePointerIcon,
  ShieldCheckIcon,
  TypeIcon,
  VariableIcon,
  WebhookIcon,
} from "lucide-react";
import type { ComponentType } from "react";

export type NodeCatalogGroupId =
  | "triggers"
  | "logic"
  | "data"
  | "ai"
  | "communication";

export type NodeCatalogItem = {
  type: NodeType;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }> | string;
  group: NodeCatalogGroupId;
  keywords: string[];
};

export const nodeCatalogGroups: Array<{
  id: NodeCatalogGroupId;
  label: string;
  description: string;
}> = [
  {
    id: "triggers",
    label: "Start",
    description: "Choose how the workflow begins.",
  },
  {
    id: "logic",
    label: "Flow",
    description: "Control where the workflow goes next.",
  },
  {
    id: "data",
    label: "Data",
    description: "Get data, save data, or write logs.",
  },
  {
    id: "ai",
    label: "AI",
    description: "Use an AI model in your workflow.",
  },
  {
    id: "communication",
    label: "Send",
    description: "Send updates to your team.",
  },
];

export const nodeCatalog: NodeCatalogItem[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Manual Trigger",
    description: "Start the workflow by clicking Run.",
    icon: MousePointerIcon,
    group: "triggers",
    keywords: ["manual", "button", "test", "run"],
  },
  {
    type: NodeType.WEBHOOK_TRIGGER,
    label: "Webhook",
    description: "Start when this URL gets a request.",
    icon: WebhookIcon,
    group: "triggers",
    keywords: ["webhook", "trigger", "api", "request", "post"],
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description: "Start when a Google Form gets a new response.",
    icon: "/logos/googleform.svg",
    group: "triggers",
    keywords: ["google", "form", "submission", "lead", "intake"],
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe Event",
    description: "Start when Stripe sends an event.",
    icon: "/logos/stripe.svg",
    group: "triggers",
    keywords: ["stripe", "payment", "billing", "webhook"],
  },
  {
    type: NodeType.ROUTER,
    label: "Router",
    description: "Send the workflow to one named path.",
    icon: GitBranchPlusIcon,
    group: "logic",
    keywords: ["branch", "route", "switch", "decision"],
  },
  {
    type: NodeType.CONDITION,
    label: "Condition",
    description: "Go to one path for yes and one for no.",
    icon: GitForkIcon,
    group: "logic",
    keywords: ["if", "true", "false", "branch", "check"],
  },
  {
    type: NodeType.HUMAN_APPROVAL,
    label: "Human Approval",
    description: "Pause and wait for a person to approve.",
    icon: ShieldCheckIcon,
    group: "logic",
    keywords: ["approval", "review", "human", "pause"],
  },
  {
    type: NodeType.DELAY,
    label: "Delay",
    description: "Wait, then continue.",
    icon: Clock3Icon,
    group: "logic",
    keywords: ["wait", "sleep", "pause", "retry"],
  },
  {
    type: NodeType.MERGE,
    label: "Merge",
    description: "Bring branches back together.",
    icon: GitMergeIcon,
    group: "logic",
    keywords: ["merge", "join", "combine", "branch"],
  },
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Call an API and get data back.",
    icon: GlobeIcon,
    group: "data",
    keywords: ["api", "fetch", "rest", "request", "endpoint"],
  },
  {
    type: NodeType.SET_VARIABLE,
    label: "Set Variable",
    description: "Save text or data for later steps.",
    icon: VariableIcon,
    group: "data",
    keywords: ["context", "variable", "state", "assign"],
  },
  {
    type: NodeType.TEXT_TEMPLATE,
    label: "Text Template",
    description: "Build text from workflow data.",
    icon: TypeIcon,
    group: "data",
    keywords: ["text", "template", "message", "string"],
  },
  {
    type: NodeType.JSON_TRANSFORM,
    label: "JSON Transform",
    description: "Build a JSON object from workflow data.",
    icon: BracesIcon,
    group: "data",
    keywords: ["json", "transform", "object", "payload"],
  },
  {
    type: NodeType.LOGGER,
    label: "Logger",
    description: "Add a note to the run log.",
    icon: FileTextIcon,
    group: "data",
    keywords: ["log", "debug", "audit", "trace"],
  },
  {
    type: NodeType.OPENAI,
    label: "OpenAI",
    description: "Ask OpenAI and save the reply.",
    icon: "/logos/openai.svg",
    group: "ai",
    keywords: ["llm", "gpt", "openai", "ai", "model"],
  },
  {
    type: NodeType.ANTHROPIC,
    label: "Anthropic",
    description: "Ask Anthropic and save the reply.",
    icon: "/logos/anthropic.svg",
    group: "ai",
    keywords: ["anthropic", "claude", "llm", "ai", "model"],
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "Ask Gemini and save the reply.",
    icon: "/logos/gemini.svg",
    group: "ai",
    keywords: ["google", "gemini", "llm", "ai", "model"],
  },
  {
    type: NodeType.GEMMA,
    label: "Gemma",
    description: "Ask Gemma and save the reply.",
    icon: "/logos/google.svg",
    group: "ai",
    keywords: ["google", "gemma", "llm", "ai", "model"],
  },
  {
    type: NodeType.HUGGINGFACE,
    label: "Hugging Face",
    description: "Run an open-source model and save the reply.",
    icon: "/logos/huggingface.svg",
    group: "ai",
    keywords: ["huggingface", "hf", "open source", "task", "model"],
  },
  {
    type: NodeType.SLACK,
    label: "Slack",
    description: "Send a Slack message.",
    icon: "/logos/slack.svg",
    group: "communication",
    keywords: ["slack", "message", "notify", "alert"],
  },
  {
    type: NodeType.GOOGLE_SHEETS,
    label: "Google Sheets",
    description: "Read or append data to a sheet.",
    icon: "/logos/googlesheets.svg",
    group: "data",
    keywords: ["google", "sheets", "spreadsheet", "excel"],
  },
  {
    type: NodeType.EMAIL_SEND,
    label: "Send Email",
    description: "Send an automated email.",
    icon: MessageSquareShareIcon,
    group: "communication",
    keywords: ["email", "smtp", "send", "mail"],
  },
  {
    type: NodeType.EMAIL_PARSER,
    label: "Email Parser",
    description: "Extract data from incoming emails.",
    icon: FileTextIcon,
    group: "data",
    keywords: ["email", "parse", "extract", "content"],
  },
  {
    type: NodeType.SCHEDULE,
    label: "Schedule",
    description: "Run workflow on a recurring schedule.",
    icon: Clock3Icon,
    group: "triggers",
    keywords: ["cron", "schedule", "time", "recurring"],
  },
  {
    type: NodeType.DB_QUERY,
    label: "Database Query",
    description: "Run SQL queries on your DB.",
    icon: BracesIcon,
    group: "data",
    keywords: ["sql", "database", "postgres", "query"],
  },
  {
    type: NodeType.TWILIO_SMS,
    label: "Twilio SMS",
    description: "Send text messages via Twilio.",
    icon: MessageSquareShareIcon,
    group: "communication",
    keywords: ["sms", "text", "twilio", "mobile"],
  },
  {
    type: NodeType.HUBSPOT,
    label: "HubSpot CRM",
    description: "Manage contacts and deals in HubSpot.",
    icon: "/logos/hubspot.svg",
    group: "communication",
    keywords: ["crm", "hubspot", "lead", "deal"],
  },
  {
    type: NodeType.SHOPIFY,
    label: "Shopify Store",
    description: "Sync orders and products with Shopify.",
    icon: "/logos/shopify.svg",
    group: "communication",
    keywords: ["ecommerce", "shopify", "store", "order"],
  },
  {
    type: NodeType.FILE_STORAGE,
    label: "File Storage",
    description: "Upload and manage files in S3/Drive.",
    icon: GlobeIcon,
    group: "data",
    keywords: ["storage", "s3", "drive", "file", "upload"],
  },
  {
    type: NodeType.DISCORD,
    label: "Discord",
    description: "Send a Discord message.",
    icon: "/logos/discord.svg",
    group: "communication",
    keywords: ["discord", "message", "notify", "alert"],
  },
  {
    type: NodeType.X,
    label: "X (Twitter)",
    description: "Post a tweet to X.",
    icon: MessageSquareShareIcon,
    group: "communication",
    keywords: ["twitter", "x", "post", "tweet", "social"],
  },
  {
    type: NodeType.LINKEDIN,
    label: "LinkedIn",
    description: "Post an update to LinkedIn.",
    icon: MessageSquareShareIcon,
    group: "communication",
    keywords: ["linkedin", "post", "update", "social", "professional"],
  },
  {
    type: NodeType.INSTAGRAM,
    label: "Instagram",
    description: "Post a photo or update to Instagram.",
    icon: MessageSquareShareIcon,
    group: "communication",
    keywords: ["instagram", "photo", "post", "social", "meta"],
  },
  {
    type: NodeType.TELEGRAM,
    label: "Telegram",
    description: "Send a message via Telegram bot.",
    icon: MessageSquareShareIcon,
    group: "communication",
    keywords: ["telegram", "bot", "message", "notify", "alert"],
  },
];

export const getNodeCatalogItem = (type: NodeType) =>
  nodeCatalog.find((item) => item.type === type);

export const getNodeIconByGroup = (group: NodeCatalogGroupId) => {
  switch (group) {
    case "triggers":
      return BotMessageSquareIcon;
    case "logic":
      return GitBranchPlusIcon;
    case "data":
      return FileTextIcon;
    case "ai":
      return BrainCircuitIcon;
    case "communication":
      return MessageSquareShareIcon;
  }
};
