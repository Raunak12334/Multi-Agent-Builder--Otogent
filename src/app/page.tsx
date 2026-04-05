import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/components/landing-page";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Otogent | Multi Agent System",
  description: "Infrastructure for Multi Agent System.",
};

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/workflows");
  }

  return <LandingPage />;
}
