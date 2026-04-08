This is a Next.js workflow automation app with a visual editor, Prisma persistence, and Inngest-powered execution.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev` starts the Next.js app
- `npm run inngest:dev` starts the Inngest dev server
- `npm run dev:all` runs the local multi-process development setup
- `npm run lint` runs Biome checks
- `npm run format` formats the codebase with Biome

## LangGraph Migration

A phased LangGraph integration plan lives in `docs/langgraph-integration-plan.md`.

The first runtime seam is scaffolded behind the `LANGGRAPH_ENABLED` environment variable:

- `LANGGRAPH_ENABLED=false` keeps the current sequential executor path
- `LANGGRAPH_ENABLED=true` routes execution through the new graph runtime entry point

The current graph runtime still uses the existing executor registry internally. That keeps behavior stable while the orchestration layer is migrated incrementally toward LangGraph.

When LangGraph is enabled, execution snapshots are persisted as checkpoints linked to each `Execution`. After pulling these changes, run your normal Prisma migration flow so the `ExecutionCheckpoint` table exists in the database.

Failed LangGraph executions can now be resumed from their latest stored checkpoint from the execution detail page.

Stored checkpoints can also be replayed into a fresh execution from the execution detail page.

LangGraph routing now supports conditional branches via connection handles, and the workflow editor includes a `Router` node for selecting a named branch from workflow state.

The workflow editor also includes a `Human Approval` node that pauses execution and exposes an approval action from the execution detail page.

Concrete execution nodes such as HTTP, Discord, Slack, and model calls remain the current tool surface. A generic `TOOL` wrapper node has been intentionally left for a later pass so the product does not end up with two overlapping abstractions.

Gemma is now integrated as a configurable model node using the existing Google Generative AI provider path. Supply a `GEMMA` credential and the exact hosted Gemma model ID exposed by your Google account.

Hugging Face is also integrated as a configurable model node for open-source language models. Supply a `HUGGINGFACE` credential and either use one of the built-in presets or enter the exact Hugging Face model ID you want to run.
