import { NodeType } from "@prisma/client";
import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/initial-node";
import { AnthropicNode } from "@/features/executions/components/anthropic/node";
import { ConditionNode } from "@/features/executions/components/condition/node";
import { DelayNode } from "@/features/executions/components/delay/node";
import { DiscordNode } from "@/features/executions/components/discord/node";
import { GeminiNode } from "@/features/executions/components/gemini/node";
import { GemmaNode } from "@/features/executions/components/gemma/node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { HuggingFaceNode } from "@/features/executions/components/huggingface/node";
import { HumanApprovalNode } from "@/features/executions/components/human-approval/node";
import { JsonTransformNode } from "@/features/executions/components/json-transform/node";
import { LoggerNode } from "@/features/executions/components/logger/node";
import { MergeNode } from "@/features/executions/components/merge/node";
import { OpenAiNode } from "@/features/executions/components/openai/node";
import { RouterNode } from "@/features/executions/components/router/node";
import { SetVariableNode } from "@/features/executions/components/set-variable/node";
import { SlackNode } from "@/features/executions/components/slack/node";
import { TextTemplateNode } from "@/features/executions/components/text-template/node";
import { GoogleFormTrigger } from "@/features/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { StripeTriggerNode } from "@/features/triggers/components/stripe-trigger/node";
import { WebhookTriggerNode } from "@/features/triggers/components/webhook-trigger/node";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.WEBHOOK_TRIGGER]: WebhookTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.ROUTER]: RouterNode,
  [NodeType.CONDITION]: ConditionNode,
  [NodeType.HUMAN_APPROVAL]: HumanApprovalNode,
  [NodeType.SET_VARIABLE]: SetVariableNode,
  [NodeType.TEXT_TEMPLATE]: TextTemplateNode,
  [NodeType.JSON_TRANSFORM]: JsonTransformNode,
  [NodeType.DELAY]: DelayNode,
  [NodeType.MERGE]: MergeNode,
  [NodeType.LOGGER]: LoggerNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GEMMA]: GemmaNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.OPENAI]: OpenAiNode,
  [NodeType.HUGGINGFACE]: HuggingFaceNode,
  [NodeType.ANTHROPIC]: AnthropicNode,
  [NodeType.DISCORD]: DiscordNode,
  [NodeType.SLACK]: SlackNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
