"use server";

import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import crypto from "crypto";

export async function submitOnboardingForm(data: {
  fullName: string;
  companyName: string;
  companySize: string;
  role: string;
  useCase: string;
  token?: string; // Optional invite token
}) {
  const session = await requireAuth();
  const userEmail = session.user.email.toLowerCase().trim();

  // 1. If a token is provided, validate it strictly
  if (data.token) {
    const tokenHash = crypto.createHash("sha256").update(data.token).digest("hex");
    const pendingInvite = await prisma.teamInvite.findUnique({
      where: { tokenHash },
      include: { organization: true }
    });

    if (!pendingInvite || pendingInvite.status !== "PENDING" || pendingInvite.expiresAt < new Date()) {
      throw new Error("Invalid or expired invitation token.");
    }

    // Join existing organization
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.fullName,
        role: pendingInvite.role,
        onboardingCompleted: true,
        organizationId: pendingInvite.organizationId,
      },
    });

    // Mark invite as accepted
    await prisma.teamInvite.update({
      where: { id: pendingInvite.id },
      data: { status: "ACCEPTED" }
    });

    redirect("/workflows");
  }

  // 2. Fallback: Check if there's a pending invitation by email (legacy/convenience)
  const inviteByEmail = await prisma.teamInvite.findFirst({
    where: {
      email: userEmail,
      status: "PENDING",
      expiresAt: { gt: new Date() }
    }
  });

  if (inviteByEmail) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.fullName,
        role: inviteByEmail.role,
        onboardingCompleted: true,
        organizationId: inviteByEmail.organizationId,
      },
    });

    await prisma.teamInvite.update({
      where: { id: inviteByEmail.id },
      data: { status: "ACCEPTED" }
    });

    redirect("/workflows");
  }

  // 3. Normal path: create organization
  if (!data.companyName || !data.fullName) {
    throw new Error("Full Name and Company Name are required.");
  }

  // Ensure user doesn't already have an organization (prevent double creation)
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { organizationId: true, onboardingCompleted: true }
  });

  if (currentUser?.organizationId && currentUser?.onboardingCompleted) {
    redirect("/workflows");
  }

  const org = await prisma.organization.create({
    data: {
      name: data.companyName,
      companySize: data.companySize,
      useCase: data.useCase,
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.fullName,
      role: "ADMIN",
      onboardingCompleted: true,
      organizationId: org.id,
    },
  });

  redirect("/pricing");
}
