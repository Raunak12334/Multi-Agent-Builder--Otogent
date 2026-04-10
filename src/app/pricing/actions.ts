"use server";

import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/db";

export async function selectFreeTier() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { organization: true },
  });

  if (!user || !user.organizationId) {
    throw new Error("User must complete onboarding first.");
  }

  const existingSubscription = await prisma.subscription.findUnique({
    where: { organizationId: user.organizationId },
  });

  if (existingSubscription) {
    redirect("/workflows");
  }

  // Calculate dates correctly
  const now = new Date();
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  await prisma.subscription.create({
    data: {
      organizationId: user.organizationId,
      plan: "FREE",
      freeTierStartedAt: now,
      expiresAt: expires,
    },
  });

  redirect("/workflows");
}
