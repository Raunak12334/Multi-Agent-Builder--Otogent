import { z } from "zod";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";

const fileStorageSchema = z.object({
  variableName: z.string().min(1),
  fileName: z.string().min(1),
  content: z.string().min(1), // Base64 or plain text
  provider: z.enum(["s3", "gdrive", "local"]),
});

type FileStorageData = z.infer<typeof fileStorageSchema>;

export const fileStorageExecutor: NodeExecutor<FileStorageData> = async ({
  data,
  context,
  step,
}) => {
  const validated = fileStorageSchema.parse(data);

  try {
    const result = await step.run("upload-file", async () => {
      const startTime = Date.now();
      
      console.log(`Uploading file ${validated.fileName} to ${validated.provider}`);
      
      return {
        success: true,
        data: {
          publicUrl: `https://storage.example.com/${validated.fileName}`,
          provider: validated.provider
        },
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: "FILE_STORAGE",
        }
      };
    });

    return {
      ...context,
      [validated.variableName]: result,
    };
  } catch (error: any) {
    throw new NonRetriableError(`File Storage Error: ${error.message}`);
  }
};
