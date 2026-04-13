"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  FilterIcon,
  MessageSquareIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTRPC } from "@/trpc/client";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export default function SupportTicketsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: tickets, isLoading } = useQuery(
    trpc.platform.getTickets.queryOptions(),
  );

  const updateStatus = useMutation(
    trpc.platform.updateTicketStatus.mutationOptions({
      onSuccess: () => {
        toast.success("Ticket status updated");
        queryClient.invalidateQueries(trpc.platform.getTickets.queryOptions());
      },
      onError: (err) => {
        toast.error(`Error: ${err.message}`);
      },
    }),
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-rose-500 text-white hover:bg-rose-600";
      case "HIGH":
        return "bg-orange-500 text-white hover:bg-orange-600";
      case "MEDIUM":
        return "bg-amber-500 text-white hover:bg-amber-600";
      default:
        return "bg-slate-500 text-white hover:bg-slate-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <CheckCircle2Icon className="size-4 text-emerald-500" />;
      case "IN_PROGRESS":
        return <ClockIcon className="size-4 text-amber-500" />;
      case "OPEN":
        return <AlertTriangleIcon className="size-4 text-rose-500" />;
      default:
        return <TicketIcon className="size-4 text-slate-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48" />
        {[1, 2, 3, 4, 5].map((slot) => (
          <div
            key={`ticket-skeleton-${slot}`}
            className="h-24 bg-slate-100 rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50">
            Support Command
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage and resolve platform-wide user escalations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <FilterIcon className="size-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-rose-50/50 dark:bg-rose-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-rose-600">
              Open Escalations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">
              {tickets?.filter((t) => t.status === "OPEN").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-amber-50/50 dark:bg-amber-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-amber-600">
              Active Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">
              {tickets?.filter((t) => t.status === "IN_PROGRESS").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-emerald-50/50 dark:bg-emerald-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-emerald-600">
              Resolved Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">
              {tickets?.filter((t) => t.status === "RESOLVED").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {tickets?.map((ticket) => (
          <Card
            key={ticket.id}
            className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-stretch">
              <div
                className={`w-2 ${
                  ticket.priority === "URGENT"
                    ? "bg-rose-500"
                    : ticket.priority === "HIGH"
                      ? "bg-orange-500"
                      : "bg-slate-200"
                }`}
              />
              <div className="flex-1 p-6 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">
                      #{ticket.id.slice(-8)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {ticket.subject}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2">
                    {ticket.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                    <div className="flex items-center gap-1 font-medium text-slate-600">
                      <UsersIcon className="size-3" /> {ticket.user.name} (
                      {ticket.user.email})
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquareIcon className="size-3" />{" "}
                      {ticket.organization?.name || "Personal Account"}
                    </div>
                    <div>
                      Opened{" "}
                      {formatDistanceToNow(new Date(ticket.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {getStatusIcon(ticket.status)}
                    <span className="uppercase tracking-widest">
                      {ticket.status.replace("_", " ")}
                    </span>
                  </div>

                  <Select
                    defaultValue={ticket.status}
                    onValueChange={(val: TicketStatus) =>
                      updateStatus.mutate({ id: ticket.id, status: val })
                    }
                    disabled={updateStatus.isPending}
                  >
                    <SelectTrigger className="w-[180px] bg-slate-50 dark:bg-slate-800 border-none">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Mark Resolved</SelectItem>
                      <SelectItem value="CLOSED">Archive/Close</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {tickets?.length === 0 && (
          <div className="py-20 text-center space-y-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="size-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <TicketIcon className="size-8 text-slate-300" />
            </div>
            <p className="text-slate-400 font-medium">
              No tickets require intervention at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
