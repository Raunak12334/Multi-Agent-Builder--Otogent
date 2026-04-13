import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";
export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return { auth: session };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

import prisma from "@/lib/db";

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { organizationId: true },
  });

  if (!user?.organizationId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Organization not found. Please complete onboarding.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      auth: {
        ...session,
        organizationId: user.organizationId,
      },
    },
  });
});
export const premiumProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    // 1. Check local DB subscription first (Free Tier)
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId: ctx.auth.organizationId },
    });

    const isLocalActive =
      subscription &&
      (!subscription.expiresAt || subscription.expiresAt > new Date());

    if (isLocalActive) {
      return next({ ctx });
    }

    // 2. Check Polar for external paid subscription
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    if (
      !customer.activeSubscriptions ||
      customer.activeSubscriptions.length === 0
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "Active subscription required. Your free trial may have expired.",
      });
    }

    return next({ ctx: { ...ctx, customer } });
  },
);

export const superAdminProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "SUPER_ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Super Admin access required",
    });
  }

  return next({
    ctx: {
      ...ctx,
      auth: session,
    },
  });
});
