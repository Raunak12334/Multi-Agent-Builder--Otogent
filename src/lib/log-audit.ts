import type { Prisma } from "@prisma/client";
import type { InputJsonValue } from "@prisma/client/runtime/library";
import prisma from "@/lib/db";

export async function logAudit(params: {
  userId?: string;
  organizationId?: string;
  action: string;
  metadata?: Prisma.InputJsonObject;
}) {
  const { userId, organizationId, action, metadata } = params;
  if (!organizationId && !userId) return;
  await prisma.auditLog.create({
    data: {
      userId: userId ?? null,
      organizationId: organizationId ?? "",
      action,
      metadata: (metadata as InputJsonValue) ?? undefined,
    },
  });
}
