"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  level: z.enum(["info", "warn", "error"]),
  message: z.string().min(1, "Message is required"),
  variableName: z
    .string()
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
    })
    .optional()
    .or(z.literal("")),
});

export type LoggerFormValues = {
  level: "info" | "warn" | "error";
  message: string;
  variableName?: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: LoggerFormValues) => void;
  defaultValues?: Partial<LoggerFormValues>;
}

export const LoggerDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: defaultValues.level || "info",
      message: defaultValues.message || "",
      variableName: defaultValues.variableName || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        level: defaultValues.level || "info",
        message: defaultValues.message || "",
        variableName: defaultValues.variableName || "",
      });
    }
  }, [defaultValues, form, open]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      level: values.level,
      message: values.message,
      variableName: values.variableName || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logger</DialogTitle>
          <DialogDescription>
            Log a templated message during workflow execution.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 space-y-8"
          >
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Log Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warn">Warn</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Controls which console method will be used.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ticket status: {{ticket.status}}"
                      className="min-h-[96px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Supports variables and helpers like {"{{json data}}"}.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="logResult" {...field} />
                  </FormControl>
                  <FormDescription>
                    Store the rendered message for downstream nodes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
