import { NonRetriableError } from "inngest";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { ExecutionStatus, type NodeType } from "@prisma/client";
import { isLangGraphEnabled } from "@/langgraph/config";
import { runWorkflowGraph } from "@/langgraph/run-graph";
import prisma from "@/lib/db";
import { anthropicChannel } from "./channels/anthropic";
import { discordChannel } from "./channels/discord";
import { geminiChannel } from "./channels/gemini";
import { gemmaChannel } from "./channels/gemma";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { openAiChannel } from "./channels/openai";
import { slackChannel } from "./channels/slack";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { inngest } from "./client";
import { topologicalSort } from "./utils";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: process.env.NODE_ENV === "production" ? 3 : 0,
    onFailure: async ({ event }) => {
      return prisma.execution.update({
        where: { inngestEventId: event.data.event.id },
        data: {
          status: ExecutionStatus.FAILED,
          error: event.data.error.message,
          errorStack: event.data.error.stack,
        },
      });
    },
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      gemmaChannel(),
      geminiChannel(),
      openAiChannel(),
      anthropicChannel(),
      discordChannel(),
      slackChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;
    const resumeExecutionId = event.data.executionId as string | undefined;
    const checkpointId = event.data.checkpointId as string | undefined;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("Event ID or workflow ID is missing");
    }

    const execution = await step.run("create-execution", async () => {
      if (resumeExecutionId) {
        return prisma.execution.update({
          where: {
            id: resumeExecutionId,
            workflowId,
          },
          data: {
            status: ExecutionStatus.RUNNING,
            error: null,
            errorStack: null,
            completedAt: null,
            inngestEventId,
            output: null,
          },
        });
      }

      return prisma.execution.create({
        data: {
          workflowId,
          inngestEventId,
        },
      });
    });

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    const userId = await step.run("find-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: {
          userId: true,
        },
      });

      return workflow.userId;
    });

    const graphResult = isLangGraphEnabled()
      ? await runWorkflowGraph({
          executionId: execution.id,
          workflowId,
          userId,
          inngestEventId,
          checkpointId,
          initialData: event.data.initialData || {},
          step,
          publish,
        })
      : null;

    const context = graphResult?.output
      ? graphResult.output
      : await step.run("execute-legacy-workflow", async () => {
          let legacyContext = event.data.initialData || {};

          for (const node of sortedNodes) {
            const executor = getExecutor(node.type as NodeType);
            legacyContext = await executor({
              data: node.data as Record<string, unknown>,
              nodeId: node.id,
              userId,
              context: legacyContext,
              step,
              publish,
            });
          }

          return legacyContext;
        });

    if (graphResult?.awaitingApproval) {
      await step.run("mark-waiting-approval", async () => {
        return prisma.execution.update({
          where: { id: execution.id },
          data: {
            status: ExecutionStatus.WAITING_APPROVAL,
            output: context,
          },
        });
      });

      return {
        workflowId,
        result: context,
        waitingForApproval: true,
      };
    }

    await step.run("update-execution", async () => {
      return prisma.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context,
        },
      });
    });

    return {
      workflowId,
      result: context,
    };
  },
);
