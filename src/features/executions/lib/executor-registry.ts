import { NodeType } from "@prisma/client";
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";
import { webhookTriggerExecutor } from "@/features/triggers/components/webhook-trigger/executor";
import { anthropicExecutor } from "../components/anthropic/executor";
import { conditionExecutor } from "../components/condition/executor";
import { delayExecutor } from "../components/delay/executor";
import { discordExecutor } from "../components/discord/executor";
import { geminiExecutor } from "../components/gemini/executor";
import { gemmaExecutor } from "../components/gemma/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { huggingFaceExecutor } from "../components/huggingface/executor";
import { humanApprovalExecutor } from "../components/human-approval/executor";
import { jsonTransformExecutor } from "../components/json-transform/executor";
import { loggerExecutor } from "../components/logger/executor";
import { mergeExecutor } from "../components/merge/executor";
import { openAiExecutor } from "../components/openai/executor";
import { routerExecutor } from "../components/router/executor";
import { setVariableExecutor } from "../components/set-variable/executor";
import { slackExecutor } from "../components/slack/executor";
import { textTemplateExecutor } from "../components/text-template/executor";
import { xExecutor } from "../components/x/executor";
import { linkedinExecutor } from "../components/linkedin/executor";
import { instagramExecutor } from "../components/instagram/executor";
import { telegramExecutor } from "../components/telegram/executor";
import type { NodeExecutor } from "../types";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.WEBHOOK_TRIGGER]: webhookTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.ROUTER]: routerExecutor,
  [NodeType.CONDITION]: conditionExecutor,
  [NodeType.HUMAN_APPROVAL]: humanApprovalExecutor,
  [NodeType.SET_VARIABLE]: setVariableExecutor,
  [NodeType.TEXT_TEMPLATE]: textTemplateExecutor,
  [NodeType.JSON_TRANSFORM]: jsonTransformExecutor,
  [NodeType.DELAY]: delayExecutor,
  [NodeType.MERGE]: mergeExecutor,
  [NodeType.LOGGER]: loggerExecutor,
  [NodeType.GEMMA]: gemmaExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.ANTHROPIC]: anthropicExecutor,
  [NodeType.OPENAI]: openAiExecutor,
  [NodeType.HUGGINGFACE]: huggingFaceExecutor,
  [NodeType.DISCORD]: discordExecutor,
  [NodeType.SLACK]: slackExecutor,
  [NodeType.X]: xExecutor,
  [NodeType.LINKEDIN]: linkedinExecutor,
  [NodeType.INSTAGRAM]: instagramExecutor,
  [NodeType.TELEGRAM]: telegramExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};
