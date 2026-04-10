import { z } from "zod";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";

const shopifySchema = z.object({
  variableName: z.string().min(1),
  shopUrl: z.string().min(1),
  accessToken: z.string().min(1),
  action: z.enum(["get_order", "create_product", "update_inventory"]),
  data: z.record(z.any()).optional(),
});

type ShopifyData = z.infer<typeof shopifySchema>;

export const shopifyExecutor: NodeExecutor<ShopifyData> = async ({
  data,
  context,
  step,
}) => {
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
        }
      };
    });

    return {
      ...context,
      [validated.variableName]: result,
    };
  } catch (error: any) {
    throw new NonRetriableError(`Shopify Error: ${error.message}`);
  }
};
