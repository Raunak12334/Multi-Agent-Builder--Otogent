import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import ky from "ky";
import type { NodeExecutor } from "@/features/executions/types";
import { telegramChannel } from "@/inngest/channels/telegram";

type TelegramData = {
  variableName?: string;
  botToken?: string;
  chatId?: string;
  text?: string;
};

export const telegramExecutor: NodeExecutor<TelegramData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    telegramChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.text) {
    throw new NonRetriableError("Telegram node: Message text is required");
  }

  const text = decode(Handlebars.compile(data.text)(context));

  try {
    const result = await step.run("telegram-send-message", async () => {
      if (!data.botToken || !data.chatId) {
        console.log(
          `[Telegram Node Mock] Sending message to ${data.chatId || "unknown"}: ${text}`,
        );
      } else {
        await ky.post(
          `https://api.telegram.org/bot${data.botToken}/sendMessage`,
          {
            json: {
              chat_id: data.chatId,
              text,
            },
          },
        );
      }

      if (!data.variableName) {
        throw new NonRetriableError("Telegram node: Variable name is missing");
      }

      return {
        ...context,
        [data.variableName]: {
          messageText: text,
          sentAt: new Date().toISOString(),
        },
      };
    });

    await publish(
      telegramChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      telegramChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
