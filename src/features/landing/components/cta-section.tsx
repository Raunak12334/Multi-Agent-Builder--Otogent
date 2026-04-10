import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="card-3d relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-12 text-center sm:p-16">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Intelligence,
              <br />
              <span className="text-gradient">orchestrated.</span>
            </h2>
            <p className="mx-auto mb-8 max-w-md text-muted-foreground">
              Join the builders creating the next generation of AI-powered
              applications — without the complexity.
            </p>
            <Button
              asChild
              variant="hero"
              size="lg"
              className="px-10 text-base"
            >
              <Link href="/signup">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
