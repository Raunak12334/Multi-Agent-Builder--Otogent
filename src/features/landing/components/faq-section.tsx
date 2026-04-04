import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is Otogent and how does it work?",
    a: "Otogent is an infrastructure platform for multi-agent systems. It provides connectors, orchestration, and shared state so your AI agents can work together, similar to how Zapier connects apps, but designed for autonomous agents.",
  },
  {
    q: "Which agent frameworks are supported?",
    a: "We support LangChain, CrewAI, AutoGen, Semantic Kernel, and custom agents via APIs. If your agent can make HTTP calls, it can work with Otogent.",
  },
  {
    q: "Do I need coding experience?",
    a: "The visual workflow editor covers no-code use cases. For advanced systems, TypeScript-first building blocks give you full control.",
  },
  {
    q: "How is Otogent different from Zapier?",
    a: "Zapier connects SaaS apps with simple triggers and actions. Otogent is built for AI agents, with stateful orchestration, shared memory, guardrails, and complex multi-step reasoning workflows.",
  },
  {
    q: "Is my data secure?",
    a: "Otogent is designed with encryption, role-aware access, and auditable execution flows so teams can safely run production-grade agent systems.",
  },
];

export function FAQSection() {
  return (
    <section id="faqs" className="bg-muted/50 py-24">
      <div className="container">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-[0.3em] text-primary uppercase">
            FAQ
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Frequently asked questions
          </h2>
        </div>

        <Accordion
          type="single"
          collapsible
          className="mx-auto max-w-3xl space-y-3"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.q}
              value={`faq-${index}`}
              className="card-3d rounded-lg border border-border bg-card px-6"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
