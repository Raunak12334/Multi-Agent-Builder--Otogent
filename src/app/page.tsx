import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LandingPage } from "@/features/landing/components/landing-page";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Otogent — Infrastructure for Multi Agent System",
  description:
    "Otogent — Build, deploy, and manage AI agent workflows in minutes. Connect models from OpenAI, Anthropic, and Gemini. No infrastructure required.",
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
