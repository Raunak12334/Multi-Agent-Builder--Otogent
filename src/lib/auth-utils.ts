import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import prisma from "./db";

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
};

/**
 * Enforces that a user belongs to an organization.
 * CRITICAL for multi-tenant isolation.
 */
export const requireOrganization = async () => {
  const session = await requireAuth();
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { 
      id: true, 
      organizationId: true,
      role: true 
    }
  });

  if (!user || !user.organizationId) {
    redirect("/onboarding");
  }

  return { 
    session, 
    user: {
      ...session.user,
      organizationId: user.organizationId,
      role: user.role
    } 
  };
};

/**
 * Security helper to ensure a resource belongs to the user's organization.
 * Use this in every server action/API that fetches by ID.
 */
export function assertSameOrganization(resourceOrgId: string, userOrgId: string) {
  if (resourceOrgId !== userOrgId) {
    console.error(`SECURITY ALERT: Cross-organization access attempt. User Org: ${userOrgId}, Resource Org: ${resourceOrgId}`);
    throw new Error("Unauthorized: Access Denied");
  }
}

export const requireUnauth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/workflows");
  }
};

export const enforceAppRouting = async (currentPath?: string) => {
  const session = await requireAuth();
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: {
        include: { subscription: true }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const { organizationId, onboardingCompleted, organization } = user;
  
  if (!organizationId || !onboardingCompleted) {
    if (currentPath !== "/onboarding") {
      redirect("/onboarding");
    }
    return { session, user };
  }

  if (!organization?.subscription) {
    if (currentPath !== "/pricing") {
      redirect("/pricing");
    }
    return { session, user }; 
  }

  if (currentPath === "/onboarding" || currentPath === "/pricing") {
    redirect("/workflows"); 
  }
  
  return { session, user };
};
