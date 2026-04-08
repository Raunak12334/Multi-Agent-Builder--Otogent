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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  variableName: z
    .string()
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
    })
    .optional()
    .or(z.literal("")),
  message: z.string().min(1, "Approval message is required"),
});

export type HumanApprovalFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HumanApprovalFormValues) => void;
  defaultValues?: Partial<HumanApprovalFormValues>;
}

export const HumanApprovalDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      message: defaultValues.message || "Please review and approve this step.",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        message:
          defaultValues.message || "Please review and approve this step.",
      });
    }
  }, [defaultValues, form, open]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      variableName: values.variableName || undefined,
      message: values.message,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Human Approval Configuration</DialogTitle>
          <DialogDescription>
            Pause execution and wait for an explicit approval in the execution
            detail view.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 space-y-8"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="approval" {...field} />
                  </FormControl>
                  <FormDescription>
                    Store the approval result for later nodes as
                    {" {{approval.approved}}"}.
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
                  <FormLabel>Approval Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please confirm before continuing."
                      className="min-h-[120px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This message is shown when the execution pauses for
                    approval. Use {"{{variables}}"} to include workflow data.
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
