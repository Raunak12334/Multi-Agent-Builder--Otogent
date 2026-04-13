"use client";

import { useMutation } from "@tanstack/react-query";
import {
  HeadphonesIcon,
  LifeBuoyIcon,
  SendIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";

export default function UserSupportPage() {
  const trpc = useTRPC();
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  >("MEDIUM");

  const { mutate: createTicket, isPending } = useMutation(
    trpc.platform.createTicket.mutationOptions({
      onSuccess: () => {
        toast.success("Support ticket escalated to platform administrators.");
        router.push("/workflows");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to transmit ticket.");
      },
    }),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket({ subject, message, priority });
  };

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50">
            Support Terminal
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Direct escalation to the Otogent internal engineering cluster.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
          <ShieldCheckIcon className="size-3" /> Priority Tier Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Submission Form */}
        <Card className="lg:col-span-8 border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <CardTitle className="text-xl font-black">
              Open Support Case
            </CardTitle>
            <CardDescription>
              Initialize a forensic thread in the global queue.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label
                  htmlFor="support-subject"
                  className="text-xs font-bold text-slate-500 uppercase tracking-widest"
                >
                  Case Subject
                </Label>
                <Input
                  id="support-subject"
                  placeholder="Brief summary..."
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border-none shadow-sm h-11"
                />
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label
                  htmlFor="support-priority"
                  className="text-xs font-bold text-slate-500 uppercase tracking-widest"
                >
                  Impact Priority
                </Label>
                <Select
                  value={priority}
                  onValueChange={(value) =>
                    setPriority(value as "LOW" | "MEDIUM" | "HIGH" | "URGENT")
                  }
                >
                  <SelectTrigger
                    id="support-priority"
                    className="bg-slate-50 dark:bg-slate-800 border-none shadow-sm h-11"
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-none shadow-lg">
                    <SelectItem value="LOW">Low - General</SelectItem>
                    <SelectItem value="MEDIUM">Medium - Tech Issue</SelectItem>
                    <SelectItem value="HIGH">
                      High - Workflow Failure
                    </SelectItem>
                    <SelectItem value="URGENT">
                      Urgent - Platform Outage
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label
                  htmlFor="support-message"
                  className="text-xs font-bold text-slate-500 uppercase tracking-widest"
                >
                  Forensic Brief
                </Label>
                <Textarea
                  id="support-message"
                  placeholder="Describe your situation in detail..."
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border-none shadow-sm resize-none py-4"
                />
              </div>

              <div className="col-span-2 pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm font-bold transition-all gap-2"
                >
                  {isPending ? (
                    "Escalating..."
                  ) : (
                    <>
                      <SendIcon className="size-4" /> Initialize Escalation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Side Panels */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground p-8 relative overflow-hidden">
            <SparklesIcon className="absolute -right-4 -bottom-4 size-32 opacity-10 rotate-12" />
            <div className="relative z-10 space-y-4">
              <div className="size-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <HeadphonesIcon className="size-6" />
              </div>
              <h3 className="text-xl font-black leading-tight">
                Elite Support Tier
              </h3>
              <p className="text-primary-foreground/80 text-sm font-medium leading-relaxed">
                Your organization is currently covered by our top-tier response
                protocol with rapid lead times.
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 p-6 space-y-2">
              <ZapIcon className="size-5 text-amber-500 fill-current" />
              <div className="text-2xl font-black text-slate-900 dark:text-slate-50">
                99.9%
              </div>
              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                SLA Uptime
              </div>
            </Card>
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 p-6 space-y-2">
              <LifeBuoyIcon className="size-5 text-primary" />
              <div className="text-2xl font-black text-slate-900 dark:text-slate-50">
                &lt; 15m
              </div>
              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                Response
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
