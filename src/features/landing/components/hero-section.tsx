import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Hero3DSceneClient } from "@/features/landing/components/hero-3d-scene-client";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="absolute inset-0 z-0">
        <Hero3DSceneClient />
      </div>

      <div className="container relative z-10 py-20 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/80 px-4 py-1.5 backdrop-blur-sm">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">
            Infrastructure for Multi Agent System
          </span>
        </div>

        <h1 className="mb-6 text-4xl leading-[1.1] font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Automate Your Work With
          <br />
          <span className="text-gradient">Multi-Agent System</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Connect, coordinate, and scale AI agents like never before. Otogent
          provides the integration layer for autonomous agent workflows, think
          Zapier, but built for the agentic era.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({
                variant: "hero",
                size: "lg",
              }),
              "card-3d px-8 text-base",
            )}
          >
            Start Building <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <a
            href="#how-it-works"
            className={cn(
              buttonVariants({
                variant: "hero-outline",
                size: "lg",
              }),
              "px-8 text-base",
            )}
          >
            View Documentation
          </a>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
            100+ Integrations
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full bg-primary animate-pulse-glow"
              style={{ animationDelay: "1s" }}
            />
            Sub-second Latency
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full bg-primary animate-pulse-glow"
              style={{ animationDelay: "2s" }}
            />
            Enterprise Ready
          </div>
        </div>
      </div>
    </section>
  );
}
