import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { linkedinChannel } from "@/inngest/channels/linkedin";

type LinkedinData = {
  variableName?: string;
  accessToken?: string;
  content?: string;
  title?: string;
};

export const linkedinExecutor: NodeExecutor<LinkedinData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    linkedinChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.content) {
    await publish(
      linkedinChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("LinkedIn node: Post content is required");
  }

  const content = decode(Handlebars.compile(data.content)(context));
  const title = data.title
    ? decode(Handlebars.compile(data.title)(context))
    : "New Post";

  try {
    const result = await step.run("linkedin-post", async () => {
      console.log(`[LinkedIn Node] Posting: ${title} - ${content}`);

      if (!data.variableName) {
        throw new NonRetriableError("LinkedIn node: Variable name is missing");
      }

      return {
        ...context,
        [data.variableName]: {
          postContent: content,
          postTitle: title,
          postedAt: new Date().toISOString(),
        },
      };
    });

    await publish(
      linkedinChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      linkedinChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
