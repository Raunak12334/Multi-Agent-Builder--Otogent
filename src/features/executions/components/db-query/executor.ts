import { z } from "zod";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { PrismaClient } from "@prisma/client";

const dbQuerySchema = z.object({
  variableName: z.string().min(1),
  connectionString: z.string().min(1),
  query: z.string().min(1),
  action: z.enum(["query", "execute"]),
});

type DbQueryData = z.infer<typeof dbQuerySchema>;

export const dbQueryExecutor: NodeExecutor<DbQueryData> = async ({
  data,
  context,
  step,
}) => {
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
        }
      };
    });

    return {
      ...context,
      [validated.variableName]: result,
    };
  } catch (error: any) {
    throw new NonRetriableError(`Database Query Error: ${error.message}`);
  }
};
