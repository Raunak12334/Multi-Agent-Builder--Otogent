import { NonRetriableError } from "inngest";
import { z } from "zod";
import type { NodeExecutor } from "@/features/executions/types";
import { dbQueryChannel } from "@/inngest/channels/db-query";

const dbQuerySchema = z.object({
  variableName: z.string().min(1),
  connectionString: z.string().min(1),
  query: z.string().min(1),
  action: z.enum(["query", "execute"]),
});

type DbQueryData = z.infer<typeof dbQuerySchema>;

export const dbQueryExecutor: NodeExecutor<DbQueryData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    dbQueryChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  const validated = dbQuerySchema.parse(data);

  try {
    const result = await step.run("database-query", async () => {
      const startTime = Date.now();

      // In a real scenario, you'd initialize a connection pool here
      // For security, we would use a dedicated restricted user
      console.log(`Executing SQL: ${validated.query}`);

      return {
        success: true,
        data: [], // Mocked rows
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: "DB_QUERY",
        },
      };
    });

    await publish(
      dbQueryChannel().status({
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
      dbQueryChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError(`Database Query Error: ${error.message}`);
  }
};
