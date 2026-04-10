import { BotIcon } from "lucide-react";

export default function AgentsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] p-8 text-center">
      <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
        <BotIcon className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight font-display mb-2">
        AI Agents
      </h1>
      <p className="text-muted-foreground max-w-md">
        Automated AI agents are coming soon. Build specialized bots that can
        handle complex multi-step reasoning.
      </p>
    </div>
  );
}
