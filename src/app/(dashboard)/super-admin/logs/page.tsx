"use client";

import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { RefreshCcwIcon, ShieldCheckIcon, TerminalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";

export default function PlatformLogsPage() {
  const trpc = useTRPC();
  const {
    data: activity,
    isLoading,
    refetch,
  } = useQuery(trpc.platform.getSystemActivity.queryOptions());

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map((slot) => (
            <div key={slot} className="h-[600px] bg-slate-100 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50">
            Forensic Logistics
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Master audit trail for platform-wide mutations and executions.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2"
        >
          <RefreshCcwIcon className="size-4" /> Refresh Stream
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Audit Logs */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-950 overflow-hidden min-h-[700px]">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="size-5 text-indigo-500" />
              <CardTitle>System Audit Trail</CardTitle>
            </div>
            <CardDescription>
              Records of administrative state changes and mutations.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {activity?.auditLogs?.map((log) => (
                <div
                  key={log.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start">
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase font-black border-indigo-200 text-indigo-600"
                    >
                      {log.action}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDistanceToNow(new Date(log.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {JSON.stringify(log.metadata)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono italic">
                    ENTITY: {log.organizationId} | ORIGIN:{" "}
                    {log.userId || "SYSTEM_CORE"}
                  </div>
                </div>
              ))}
              {activity?.auditLogs?.length === 0 && (
                <div className="p-12 text-center text-slate-400 italic">
                  No historical audit records found in current segment.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Global Pipeline Stream */}
        <Card className="border-none shadow-sm bg-slate-900 text-slate-300 overflow-hidden min-h-[700px]">
          <CardHeader className="border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <TerminalIcon className="size-5 text-emerald-500" />
              <CardTitle className="text-white">Live Pipeline Stream</CardTitle>
            </div>
            <CardDescription className="text-slate-500">
              Unfiltered execution flow across all organizations.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 font-mono">
            <div className="divide-y divide-slate-800">
              {activity?.executions?.map((exec) => (
                <div
                  key={exec.id}
                  className="p-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${
                          exec.status === "SUCCESS"
                            ? "bg-emerald-500"
                            : exec.status === "FAILED"
                              ? "bg-rose-500"
                              : "bg-blue-500 animate-pulse"
                        }`}
                      />
                      <span className="text-slate-100 font-bold">
                        {exec.workflow?.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      ORG: {exec.workflow?.organization?.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-slate-500">
                      {formatDistanceToNow(new Date(exec.startedAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {exec.status === "FAILED" && (
                      <span className="text-[10px] text-rose-400 bg-rose-400/10 px-1 rounded">
                        PANIC_ERROR
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {activity?.executions?.length === 0 && (
                <div className="p-12 text-center text-slate-600 italic">
                  Waiting for active pipeline data...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
