import { Bot, GitBranch, Layers, Link2, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Universal Agent Connectors",
    description:
      "Plug any AI agent, LangChain, CrewAI, AutoGen, or custom, into a unified integration bus.",
  },
  {
    icon: GitBranch,
    title: "Workflow Orchestration",
    description:
      "Design multi-step agent workflows with branching logic, retries, and parallel execution.",
  },
  {
    icon: Zap,
    title: "Event-Driven Triggers",
    description:
      "React to webhooks, schedules, or agent outputs in real-time with zero-latency event routing.",
  },
  {
    icon: Layers,
    title: "Shared Memory & State",
    description:
      "Give agents a shared context layer so they collaborate seamlessly without duplication.",
  },
  {
    icon: Shield,
    title: "Guardrails & Governance",
    description:
      "Set budgets, permissions, and safety policies. Every agent action is auditable.",
  },
  {
    icon: Bot,
    title: "Agent Marketplace",
    description:
      "Discover and deploy pre-built agent templates for common business workflows.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="container">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-[0.3em] text-primary uppercase">
            Features
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Everything agents need to work together
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            From connectors to orchestration, Otogent handles the infrastructure
            so you can focus on outcomes.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card-3d group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
