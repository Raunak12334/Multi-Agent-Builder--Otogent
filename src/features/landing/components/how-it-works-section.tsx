const steps = [
  {
    num: "01",
    title: "Connect Your Agents",
    description:
      "Import agents from any framework or build new ones with our SDK. Each agent gets a standardized interface.",
  },
  {
    num: "02",
    title: "Define Workflows",
    description:
      "Use our visual editor or code-first approach to orchestrate how agents collaborate, share data, and hand off tasks.",
  },
  {
    num: "03",
    title: "Deploy & Monitor",
    description:
      "Push to production with one click. Monitor performance, costs, and outputs in a unified dashboard.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-muted/50 py-24">
      <div className="container">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-[0.3em] text-primary uppercase">
            How It Works
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Three steps to autonomous workflows
          </h2>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="card-3d rounded-xl border border-border bg-card p-8 text-center"
            >
              <div className="font-display mb-4 text-6xl font-bold text-primary/15">
                {step.num}
              </div>
              <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
