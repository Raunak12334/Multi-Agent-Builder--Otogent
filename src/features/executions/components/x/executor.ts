import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { xChannel } from "@/inngest/channels/x";

type XData = {
  variableName?: string;
  bearerToken?: string;
  content?: string;
};

export const xExecutor: NodeExecutor<XData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    xChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.content) {
    await publish(
      xChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("X node: Tweet content is required");
  }

  const content = decode(Handlebars.compile(data.content)(context)).slice(
    0,
    280,
  );

  try {
    const result = await step.run("x-post-tweet", async () => {
      // Mocking the API call for now as real OAuth requires a full setup
      // In a real implementation:
      // await ky.post("https://api.twitter.com/2/tweets", {
      //   headers: { Authorization: `Bearer ${data.bearerToken}` },
      //   json: { text: content }
      // });

      console.log(`[X Node] Posting tweet: ${content}`);

      if (!data.variableName) {
        throw new NonRetriableError("X node: Variable name is missing");
      }

      return {
        ...context,
        [data.variableName]: {
          tweetContent: content,
          postedAt: new Date().toISOString(),
          status: "success (mocked)",
        },
      };
    });

    await publish(
      xChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      xChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
