import { NonRetriableError } from "inngest";
import { z } from "zod";
import type { NodeExecutor } from "@/features/executions/types";
import { fileStorageChannel } from "@/inngest/channels/file-storage";

const fileStorageSchema = z.object({
  variableName: z.string().min(1),
  fileName: z.string().min(1),
  content: z.string().min(1), // Base64 or plain text
  provider: z.enum(["s3", "gdrive", "local"]),
});

type FileStorageData = z.infer<typeof fileStorageSchema>;

export const fileStorageExecutor: NodeExecutor<FileStorageData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    fileStorageChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  const validated = fileStorageSchema.parse(data);

  try {
    const result = await step.run("upload-file", async () => {
      const startTime = Date.now();

      console.log(
        `Uploading file ${validated.fileName} to ${validated.provider}`,
      );

      return {
        success: true,
        data: {
          publicUrl: `https://storage.example.com/${validated.fileName}`,
          provider: validated.provider,
        },
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: "FILE_STORAGE",
        },
      };
    });

    await publish(
      fileStorageChannel().status({
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
      fileStorageChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError(`File Storage Error: ${error.message}`);
  }
};
