import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/components/landing-page";

export const metadata: Metadata = {
  title: "Otogent | Multi Agent System",
  description: "Infrastructure for Multi Agent System.",
};

export default function Page() {
  return <LandingPage />;
}
