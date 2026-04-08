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

const formSchema = z
  .object({
    variableName: z
      .string()
      .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
        message:
          "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
      })
      .optional()
      .or(z.literal("")),
    expression: z.string().min(1, "Condition expression is required"),
    trueRoute: z.string().min(1, "True route is required"),
    falseRoute: z.string().min(1, "False route is required"),
  })
  .superRefine((values, ctx) => {
    if (values.trueRoute.trim() === values.falseRoute.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["falseRoute"],
        message: "True and false routes must be different",
      });
    }
  });

export type ConditionFormValues = {
  variableName?: string;
  expression: string;
  trueRoute: string;
  falseRoute: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ConditionFormValues) => void;
  defaultValues?: Partial<ConditionFormValues>;
}

export const ConditionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      expression: defaultValues.expression || "",
      trueRoute: defaultValues.trueRoute || "true",
      falseRoute: defaultValues.falseRoute || "false",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        expression: defaultValues.expression || "",
        trueRoute: defaultValues.trueRoute || "true",
        falseRoute: defaultValues.falseRoute || "false",
      });
    }
  }, [defaultValues, form, open]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      variableName: values.variableName || undefined,
      expression: values.expression,
      trueRoute: values.trueRoute.trim(),
      falseRoute: values.falseRoute.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Condition</DialogTitle>
          <DialogDescription>
            Evaluate an expression and route execution to the true or false
            branch.
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
                    <Input placeholder="conditionResult" {...field} />
                  </FormControl>
                  <FormDescription>
                    Store the evaluation result as{" "}
                    {"{{conditionResult.result}}"}.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expression"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expression</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="{{httpResponse.httpResponse.status}}"
                      className="min-h-[96px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Truthy values route to true, falsy values route to false.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trueRoute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>True Route Handle</FormLabel>
                  <FormControl>
                    <Input placeholder="true" {...field} />
                  </FormControl>
                  <FormDescription>
                    Outgoing handle name for truthy results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="falseRoute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>False Route Handle</FormLabel>
                  <FormControl>
                    <Input placeholder="false" {...field} />
                  </FormControl>
                  <FormDescription>
                    Outgoing handle name for falsy results.
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
