# LangGraph Integration Plan

This project already has three strong layers in place:

- A visual workflow editor backed by Prisma `Workflow`, `Node`, and `Connection`
- A server-side execution trigger through Inngest
- A registry of node executors that perform the actual work

The recommended migration path is to introduce LangGraph as the orchestration runtime without replacing the editor or persistence model in the first pass.

## Current Execution Model

Today, `src/inngest/functions.ts` does the following:

1. Creates an `Execution` record
2. Loads workflow nodes and connections from Prisma
3. Topologically sorts the nodes
4. Runs each node executor sequentially with a shared mutable `context`
5. Persists the final output

This works for linear DAG execution, but it limits richer multi-agent patterns such as:

- Typed shared state
- Conditional routing
- Parallel branches
- Supervisor / worker agent handoffs
- Durable checkpoints and resumability

## Target Architecture

LangGraph should become the workflow runtime inside the current Inngest function.

### Keep in place

- React Flow editor
- Prisma workflow schema
- Existing node config UIs
- Inngest trigger and execution lifecycle
- Realtime status publishing from node executors

### Introduce

- A typed graph state for workflow execution
- A compiler that turns persisted workflows into a graph runtime definition
- An adapter that lets existing executors behave like graph nodes
- A feature flag to switch between legacy execution and graph execution
- Checkpoint persistence tied to `Execution`

## Phase Plan

### Phase 1: Runtime Scaffolding

Goal: create the integration seam without changing behavior by default.

Deliverables:

- `src/langgraph/state.ts`
- `src/langgraph/build-graph.ts`
- `src/langgraph/run-graph.ts`
- `src/langgraph/adapters/executor-node.ts`
- `LANGGRAPH_ENABLED` feature flag
- Inngest routing through a single runtime entry point

Notes:

- In this phase, the graph runtime can still execute sequentially.
- The important part is establishing the interfaces and migration boundary.

### Phase 2: Workflow Compiler

Goal: compile Prisma workflows into a graph definition.

Tasks:

- Normalize node and connection data into a runtime representation
- Validate graph shape early
- Build adjacency lists and routing metadata
- Preserve current topological ordering as the fallback scheduling strategy

### Phase 3: Executor Adapter Layer

Goal: make current executors compatible with graph state updates.

Tasks:

- Wrap every `NodeExecutor` in a graph node adapter
- Convert current `context` reads into state access
- Convert returned objects into partial state patches
- Keep realtime publish behavior untouched

### Phase 4: LangGraph Runtime Adoption

Goal: swap internal orchestration from manual looping to LangGraph.

Tasks:

- Add LangGraph dependency
- Replace the sequential scheduler in `run-graph.ts` with a LangGraph `StateGraph`
- Preserve existing execution output contract
- Roll out behind `LANGGRAPH_ENABLED=true`

### Phase 5: Durable Checkpoints

Goal: support resumability, debugging, and long-running multi-agent workflows.

Tasks:

- Add execution checkpoint storage
- Persist graph state snapshots per execution
- Resume failed or paused runs from the latest checkpoint
- Expose checkpoint state in the execution details UI

Status:

- Initial checkpoint persistence is now scaffolded with `ExecutionCheckpoint`
- A checkpoint is written after each LangGraph node execution
- Execution details can display stored snapshots for inspection
- Failed executions can now resume from the latest stored checkpoint
- Stored checkpoints can now be replayed into a fresh execution

### Phase 6: Multi-Agent Features

Goal: unlock agent-native behavior in the product.

Candidate node types:

- `LLM_AGENT`
- `ROUTER`
- `TOOL`
- `HUMAN_APPROVAL`
- `FINALIZER`

Editor changes for this phase:

- Conditional edges
- Branch metadata
- Tool binding configuration
- Approval gates

Status:

- Conditional routing is now supported in the LangGraph compiler using stored connection handle metadata
- A `ROUTER` node is available in the editor and runtime for named-branch decisions
- A `HUMAN_APPROVAL` node is available in the editor and runtime with execution pause and approve/resume support
- Router configuration now validates route names, uniqueness, and fallback consistency
- Existing concrete action nodes currently serve as the tool surface; a generic `TOOL` wrapper node is still deferred
- A `GEMMA` node is available as a configurable hosted-model integration through the existing Google provider path

## Recommended First Milestone

Prove the architecture with one end-to-end path:

- `HTTP_REQUEST -> OPENAI -> DISCORD`

Success criteria:

- Workflow can still be triggered from the current editor
- Inngest still owns execution lifecycle
- The new runtime entry point handles orchestration
- Existing node executors run through the adapter layer

## Risks To Manage Early

- Current state shape is too loose for agent orchestration
- Stored workflow edges do not yet model routing conditions
- Parallel branches will need deterministic merge behavior
- Checkpoint persistence likely requires a Prisma schema update
- Realtime status updates must remain stable during migration
