import { z } from "zod";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";

const hubspotSchema = z.object({
  variableName: z.string().min(1),
  accessToken: z.string().min(1),
  action: z.enum(["create_contact", "update_deal", "get_company"]),
  properties: z.record(z.any()),
});

type HubspotData = z.infer<typeof hubspotSchema>;

export const hubspotExecutor: NodeExecutor<HubspotData> = async ({
  data,
  context,
  step,
}) => {
  const validated = hubspotSchema.parse(data);

  try {
    const result = await step.run("hubspot-api-call", async () => {
      const startTime = Date.now();
      
      console.log(`HubSpot ${validated.action}:`, validated.properties);
      
      return {
        success: true,
        data: { id: "hs_12345", properties: validated.properties },
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: "HUBSPOT",
        }
      };
    });

    return {
      ...context,
      [validated.variableName]: result,
    };
  } catch (error: any) {
    throw new NonRetriableError(`HubSpot Error: ${error.message}`);
  }
};
