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

const parseRoutes = (value: string) =>
  value
    .split(",")
    .map((route) => route.trim())
    .filter(Boolean);

const routeNameSchema = /^[A-Za-z0-9_-]+$/;

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
    routeExpression: z.string().min(1, "Route expression is required"),
    routesText: z.string().min(1, "At least one route is required"),
    fallbackRoute: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const routes = parseRoutes(values.routesText);

    if (routes.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["routesText"],
        message: "At least one route is required",
      });
    }

    const invalidRoute = routes.find((route) => !routeNameSchema.test(route));

    if (invalidRoute) {
      ctx.addIssue({
        code: "custom",
        path: ["routesText"],
        message:
          "Route names may only contain letters, numbers, hyphens, and underscores",
      });
    }

    if (new Set(routes).size !== routes.length) {
      ctx.addIssue({
        code: "custom",
        path: ["routesText"],
        message: "Route names must be unique",
      });
    }

    if (values.fallbackRoute && !routes.includes(values.fallbackRoute.trim())) {
      ctx.addIssue({
        code: "custom",
        path: ["fallbackRoute"],
        message: "Fallback route must match one of the available routes",
      });
    }
  });

export type RouterFormValues = {
  variableName?: string;
  routeExpression: string;
  routes: string[];
  fallbackRoute?: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: RouterFormValues) => void;
  defaultValues?: Partial<RouterFormValues>;
}

export const RouterDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      routeExpression: defaultValues.routeExpression || "",
      routesText: defaultValues.routes?.join(", ") || "success, failure",
      fallbackRoute: defaultValues.fallbackRoute || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        routeExpression: defaultValues.routeExpression || "",
        routesText: defaultValues.routes?.join(", ") || "success, failure",
        fallbackRoute: defaultValues.fallbackRoute || "",
      });
    }
  }, [defaultValues, form, open]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const routes = parseRoutes(values.routesText);

    onSubmit({
      variableName: values.variableName || undefined,
      routeExpression: values.routeExpression,
      routes,
      fallbackRoute: values.fallbackRoute?.trim() || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Router Configuration</DialogTitle>
          <DialogDescription>
            Choose a branch name from workflow state and route execution to the
            matching outgoing handle.
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
                    <Input placeholder="routeResult" {...field} />
                  </FormControl>
                  <FormDescription>
                    Store the selected route for later nodes as
                    {" {{routeResult.selectedRoute}}"}.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="routeExpression"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route Expression</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="success"
                      className="min-h-[100px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Render a route name from workflow state, for example
                    {" success"}, {" failure"}, or {" {{decision.text}}"}.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="routesText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Routes</FormLabel>
                  <FormControl>
                    <Input placeholder="success, failure" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated route names. The node will create one output
                    handle for each route.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fallbackRoute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fallback Route (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="failure" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used when the rendered route does not match one of the
                    available routes.
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
