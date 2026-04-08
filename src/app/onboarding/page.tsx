import { enforceAppRouting } from "@/lib/auth-utils";
import { OnboardingWizard } from "./wizard";
import prisma from "@/lib/db";
import crypto from "crypto";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const { session } = await enforceAppRouting("/onboarding");

  let pendingInvite = null;
  const userEmail = session.user.email.toLowerCase().trim();
  
  if (token) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    pendingInvite = await prisma.teamInvite.findUnique({
      where: { tokenHash },
      include: { organization: true }
    });
  } else {
    pendingInvite = await prisma.teamInvite.findFirst({
      where: {
        email: userEmail,
        status: "PENDING",
        expiresAt: { gt: new Date() }
      }
    });
  }

  return <OnboardingWizard hasInvite={!!pendingInvite} token={token} />;
}
