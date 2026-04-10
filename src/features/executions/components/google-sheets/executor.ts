import { z } from "zod";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { googleSheetsChannel } from "@/inngest/channels/google-sheets";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { google } from "googleapis";

const googleSheetsSchema = z.object({
  variableName: z.string().min(1),
  credentialId: z.string().min(1),
  spreadsheetId: z.string().min(1),
  range: z.string().min(1),
  action: z.enum(["read", "append", "update"]),
  values: z.array(z.array(z.any())).optional(),
});

type GoogleSheetsData = z.infer<typeof googleSheetsSchema>;

export const googleSheetsExecutor: NodeExecutor<GoogleSheetsData> = async ({
  data,
  nodeId,
  organizationId,
  context,
  step,
  publish,
}) => {
  await publish(
    googleSheetsChannel.status({
      nodeId,
      status: "loading",
    }),
  );

  const validated = googleSheetsSchema.parse(data);

  const credential = await step.run("get-google-credential", async () => {
    return prisma.credential.findFirstOrThrow({
      where: { id: validated.credentialId, organizationId },
    });
  });

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: decrypt(credential.valueEncrypted || credential.value),
  });

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const result = await step.run("google-sheets-action", async () => {
      let response;
      const startTime = Date.now();

      if (validated.action === "read") {
        response = await sheets.spreadsheets.values.get({
          spreadsheetId: validated.spreadsheetId,
          range: validated.range,
        });
      } else if (validated.action === "append") {
        response = await sheets.spreadsheets.values.append({
          spreadsheetId: validated.spreadsheetId,
          range: validated.range,
          valueInputOption: "USER_ENTERED",
          requestBody: { values: validated.values || [] },
        });
      }

      return {
        success: true,
        data: response?.data || {},
        metadata: {
          executionTime: Date.now() - startTime,
          nodeType: "GOOGLE_SHEETS",
          action: validated.action
        }
      };
    });

    return {
      ...context,
      [validated.variableName]: result,
    };
  } catch (error: any) {
    throw new NonRetriableError(`Google Sheets Error: ${error.message}`);
  }
};
