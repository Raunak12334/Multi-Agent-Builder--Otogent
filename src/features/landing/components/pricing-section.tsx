import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For experimenting with agent workflows",
    features: [
      "3 agents",
      "1,000 executions/mo",
      "Community support",
      "Basic integrations",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$49",
    description: "For teams building production systems",
    features: [
      "Unlimited agents",
      "50,000 executions/mo",
      "Priority support",
      "All integrations",
      "Shared memory",
      "Custom triggers",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations at scale",
    features: [
      "Unlimited everything",
      "Dedicated infrastructure",
      "SLA guarantee",
      "SSO & RBAC",
      "On-prem deployment",
      "Dedicated CSM",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24">
      <div className="container">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-[0.3em] text-primary uppercase">
            Pricing
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Transparent pricing for every scale
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Start free. Scale as your agent fleet grows.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card-3d flex flex-col rounded-xl border p-8 ${
                plan.featured
                  ? "relative border-primary/50 bg-card"
                  : "border-border bg-card"
              }`}
            >
              {plan.featured ? (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              ) : null}
              <h3 className="font-display text-xl font-semibold">
                {plan.name}
              </h3>
              <p className="mt-1 mb-6 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mb-6">
                <span className="font-display text-4xl font-bold">
                  {plan.price}
                </span>
                {plan.price !== "Free" && plan.price !== "Custom" ? (
                  <span className="text-sm text-muted-foreground">/month</span>
                ) : null}
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-secondary-foreground"
                  >
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={plan.featured ? "hero" : "hero-outline"}
                className="w-full"
              >
                <Link href="/signup">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
