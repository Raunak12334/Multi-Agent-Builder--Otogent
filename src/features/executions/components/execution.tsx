"use client";

import { ExecutionStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  useApproveExecution,
  useReplayExecutionCheckpoint,
  useResumeExecution,
  useSuspenseExecution,
} from "@/features/executions/hooks/use-executions";

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
    case ExecutionStatus.WAITING_APPROVAL:
      return <ClockIcon className="size-5 text-amber-600" />;
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
};

const formatStatus = (status: ExecutionStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

export const ExecutionView = ({ executionId }: { executionId: string }) => {
  const { data: execution } = useSuspenseExecution(executionId);
  const approveExecution = useApproveExecution();
  const replayCheckpoint = useReplayExecutionCheckpoint();
  const resumeExecution = useResumeExecution();
  const [showStackTrace, setShowStackTrace] = useState(false);

  const duration = execution.completedAt
    ? Math.round(
        (new Date(execution.completedAt).getTime() -
          new Date(execution.startedAt).getTime()) /
          1000,
      )
    : null;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getStatusIcon(execution.status)}
          <div>
            <CardTitle>{formatStatus(execution.status)}</CardTitle>
            <CardDescription>
              Execution for {execution.workflow.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Workflow
            </p>
            <Link
              prefetch
              className="text-sm hover:underline text-primary"
              href={`/workflows/${execution.workflowId}`}
            >
              {execution.workflow.name}
            </Link>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm">{formatStatus(execution.status)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Started</p>
            <p className="text-sm">
              {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
            </p>
          </div>

          {execution.completedAt ? (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>
              <p className="text-sm">
                {formatDistanceToNow(execution.completedAt, {
                  addSuffix: true,
                })}
              </p>
            </div>
          ) : null}

          {duration !== null ? (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Duration
              </p>
              <p className="text-sm">{duration}s</p>
            </div>
          ) : null}

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Event ID
            </p>
            <p className="text-sm">{execution.inngestEventId}</p>
          </div>
        </div>

        {execution.status === ExecutionStatus.FAILED &&
        execution.checkpoints.length > 0 ? (
          <div className="flex justify-end">
            <Button
              onClick={() => resumeExecution.mutate({ id: execution.id })}
              disabled={resumeExecution.isPending}
            >
              Resume from checkpoint
            </Button>
          </div>
        ) : null}

        {execution.status === ExecutionStatus.WAITING_APPROVAL ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-amber-900">
                Waiting for approval
              </p>
              <p className="text-sm text-amber-800">
                This execution paused at a human approval node and will continue
                after approval.
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => approveExecution.mutate({ id: execution.id })}
                disabled={approveExecution.isPending}
              >
                Approve and continue
              </Button>
            </div>
          </div>
        ) : null}
        {execution.error && (
          <div className="mt-6 p-4 bg-red-50 rounded-md space-y-3">
            <div>
              <p className="text-sm font-medium text-red-900 mb-2">Error</p>
              <p className="text-sm text-red-800 font-mono">
                {execution.error}
              </p>
            </div>

            {execution.errorStack && (
              <Collapsible
                open={showStackTrace}
                onOpenChange={setShowStackTrace}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-900 hover:bg-red-100"
                  >
                    {showStackTrace ? "Hide stack trace" : "Show stack trace"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="text-xs font-mono text-red-800 overflow-auto mt-2 p-2 bg-red-100">
                    {execution.errorStack}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}

        {execution.output && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Output</p>
            <pre className="text-xs font-mono overflow-auto">
              {JSON.stringify(execution.output, null, 2)}
            </pre>
          </div>
        )}

        {execution.checkpoints.length > 0 && (
          <div className="mt-6 p-4 bg-muted rounded-md space-y-3">
            <div>
              <p className="text-sm font-medium">LangGraph Checkpoints</p>
              <p className="text-xs text-muted-foreground">
                {execution.checkpoints.length} snapshot
                {execution.checkpoints.length === 1 ? "" : "s"} captured during
                execution
              </p>
            </div>

            <div className="space-y-3">
              {execution.checkpoints.map((checkpoint) => (
                <div
                  key={checkpoint.id}
                  className="rounded-md border bg-background p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs font-medium">
                      Step {checkpoint.sequence}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {checkpoint.nodeId ?? "graph"}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          replayCheckpoint.mutate({
                            id: execution.id,
                            checkpointId: checkpoint.id,
                          })
                        }
                        disabled={replayCheckpoint.isPending}
                      >
                        Replay from here
                      </Button>
                    </div>
                  </div>
                  <pre className="text-xs font-mono overflow-auto">
                    {JSON.stringify(checkpoint.state, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
