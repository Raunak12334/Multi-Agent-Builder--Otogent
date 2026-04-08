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

const formSchema = z.object({
  amount: z.number().min(1, "Delay must be at least 1"),
  unit: z.enum(["s", "m", "h"]),
});

export type DelayFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DelayFormValues) => void;
  defaultValues?: Partial<DelayFormValues>;
}

export const DelayDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<DelayFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: defaultValues.amount ?? 5,
      unit: defaultValues.unit || "s",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        amount: defaultValues.amount ?? 5,
        unit: defaultValues.unit || "s",
      });
    }
  }, [defaultValues, form, open]);

  const handleSubmit = (values: DelayFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delay</DialogTitle>
          <DialogDescription>
            Pause execution for a fixed amount of time.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 space-y-8"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={field.value}
                      onChange={(event) => {
                        field.onChange(Number(event.target.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Number of units to wait before continuing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="s">Seconds</SelectItem>
                      <SelectItem value="m">Minutes</SelectItem>
                      <SelectItem value="h">Hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The time unit for the delay.
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
