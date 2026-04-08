import { NodeType } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { sendWorkflowExecution } from "@/inngest/utils";
import prisma from "@/lib/db";

const parseBody = async (request: NextRequest) => {
  if (request.method === "GET") {
    return {
      rawBody: "",
      body: null,
    };
  }

  const rawBody = await request.text();
  const contentType = request.headers.get("content-type") || "";

  if (!rawBody) {
    return {
      rawBody,
      body: null,
    };
  }

  if (contentType.includes("application/json")) {
    try {
      return {
        rawBody,
        body: JSON.parse(rawBody) as unknown,
      };
    } catch {
      return {
        rawBody,
        body: rawBody,
      };
    }
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return {
      rawBody,
      body: Object.fromEntries(new URLSearchParams(rawBody).entries()),
    };
  }

  return {
    rawBody,
    body: rawBody,
  };
};

const createWebhookResponse = (status: number, body: Record<string, unknown>) =>
  NextResponse.json(body, { status });

const handleWebhookRequest = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");
    const nodeId = url.searchParams.get("nodeId");

    if (!workflowId || !nodeId) {
      return createWebhookResponse(400, {
        success: false,
        error: "Missing workflowId or nodeId",
      });
    }

    const triggerNode = await prisma.node.findFirst({
      where: {
        id: nodeId,
        workflowId,
        type: NodeType.WEBHOOK_TRIGGER,
      },
      select: {
        id: true,
      },
    });

    if (!triggerNode) {
      return createWebhookResponse(404, {
        success: false,
        error: "Webhook trigger not found",
      });
    }

    const { rawBody, body } = await parseBody(request);
    const queryEntries = Object.fromEntries(url.searchParams.entries());
    const { workflowId: _workflowId, nodeId: _nodeId, ...query } = queryEntries;

    await sendWorkflowExecution({
      workflowId,
      triggerNodeId: nodeId,
      initialData: {
        webhook: {
          nodeId,
          method: request.method,
          url: `${url.origin}${url.pathname}`,
          query,
          headers: Object.fromEntries(request.headers.entries()),
          body,
          rawBody,
        },
      },
    });

    return createWebhookResponse(200, { success: true });
  } catch (error) {
    console.error("Generic webhook error:", error);

    return createWebhookResponse(500, {
      success: false,
      error: "Failed to process webhook request",
    });
  }
};

export const GET = handleWebhookRequest;
export const POST = handleWebhookRequest;
export const PUT = handleWebhookRequest;
export const PATCH = handleWebhookRequest;
export const DELETE = handleWebhookRequest;
