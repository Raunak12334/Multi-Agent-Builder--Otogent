import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { instagramChannel } from "@/inngest/channels/instagram";

type InstagramData = {
  variableName?: string;
  accessToken?: string;
  caption?: string;
  imageUrl?: string;
};

export const instagramExecutor: NodeExecutor<InstagramData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    instagramChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.caption) {
    throw new NonRetriableError("Instagram node: Caption is required");
  }

  const caption = decode(Handlebars.compile(data.caption)(context));

  try {
    const result = await step.run("instagram-post", async () => {
      console.log(`[Instagram Node] Posting image with caption: ${caption}`);

      if (!data.variableName) {
        throw new NonRetriableError("Instagram node: Variable name is missing");
      }

      return {
        ...context,
        [data.variableName]: {
          caption,
          postedAt: new Date().toISOString(),
        },
      };
    });

    await publish(
      instagramChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      instagramChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
