import { NonRetriableError } from "inngest";
import { z } from "zod";
import type { NodeExecutor } from "@/features/executions/types";
import { shopifyChannel } from "@/inngest/channels/shopify";

const shopifySchema = z.object({
  variableName: z.string().min(1),
  shopUrl: z.string().min(1),
  accessToken: z.string().min(1),
  action: z.enum(["get_order", "create_product", "update_inventory"]),
  data: z.record(z.string(), z.any()).optional(),
});

type ShopifyData = z.infer<typeof shopifySchema>;

export const shopifyExecutor: NodeExecutor<ShopifyData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    shopifyChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  const validated = shopifySchema.parse(data);

  try {
    const result = await step.run("shopify-api-call", async () => {
      const startTime = Date.now();

      console.log(`Shopify ${validated.action} on ${validated.shopUrl}`);

      return {
        success: true,
        data: { id: "shop_987", status: "fulfilled" },
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: "SHOPIFY",
        },
      };
    });

    await publish(
      shopifyChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...context,
      [validated.variableName]: result,
    };
  } catch (error: any) {
    await publish(
      shopifyChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError(`Shopify Error: ${error.message}`);
  }
};
