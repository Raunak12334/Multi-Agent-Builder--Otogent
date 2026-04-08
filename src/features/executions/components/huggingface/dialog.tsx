"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CredentialType } from "@prisma/client";
import Image from "next/image";
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
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { defaultHuggingFaceModel, huggingFaceModelPresets } from "./presets";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
    }),
  credentialId: z.string().min(1, "Credential is required"),
  model: z.string().min(1, "Model is required"),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
});

export type HuggingFaceFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HuggingFaceFormValues) => void;
  defaultValues?: Partial<HuggingFaceFormValues>;
}

export const HuggingFaceDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const { data: credentials, isLoading: isLoadingCredentials } =
    useCredentialsByType(CredentialType.HUGGINGFACE);

  const form = useForm<HuggingFaceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      credentialId: defaultValues.credentialId || "",
      model: defaultValues.model || defaultHuggingFaceModel,
      systemPrompt: defaultValues.systemPrompt || "",
      userPrompt: defaultValues.userPrompt || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        credentialId: defaultValues.credentialId || "",
        model: defaultValues.model || defaultHuggingFaceModel,
        systemPrompt: defaultValues.systemPrompt || "",
        userPrompt: defaultValues.userPrompt || "",
      });
    }
  }, [defaultValues, form, open]);

  const watchVariableName = form.watch("variableName") || "myHuggingFace";
  const watchModel = form.watch("model");

  const handleSubmit = (values: HuggingFaceFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  const applyPreset = (model: string) => {
    form.setValue("model", model, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Hugging Face Configuration</DialogTitle>
          <DialogDescription>
            Choose a model for the job, keep everything inside Otogent, and run
            it with your Hugging Face token.
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
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="myHuggingFace" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use this name to reference the result in other nodes:{" "}
                    {`{{${watchVariableName}.text}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hugging Face Credential</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingCredentials || !credentials?.length}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a credential" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {credentials?.map((credential) => (
                        <SelectItem key={credential.id} value={credential.id}>
                          <div className="flex items-center gap-2">
                            <Image
                              src="/logos/huggingface.svg"
                              alt="Hugging Face"
                              width={16}
                              height={16}
                            />
                            {credential.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Quick presets</p>
                <p className="text-sm text-muted-foreground">
                  Pick a use case to fill the model field, or paste any model ID
                  below.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {huggingFaceModelPresets.map((preset) => {
                  const isActive = watchModel === preset.model;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                        isActive
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
                      }`}
                      onClick={() => applyPreset(preset.model)}
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src="/logos/huggingface.svg"
                          alt="Hugging Face"
                          width={18}
                          height={18}
                          className="rounded-sm"
                        />
                        <p className="text-sm font-medium">{preset.label}</p>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {preset.description}
                      </p>
                      <p className="mt-2 font-mono text-xs text-muted-foreground">
                        {preset.model}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="meta-llama/Llama-3.3-70B-Instruct"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Paste any Hugging Face model ID you want to run for this
                    task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="You are a helpful assistant."
                      className="min-h-[80px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Sets the behavior of the assistant. Use {"{{variables}}"}{" "}
                    for simple values or {"{{json variable}}"} to stringify
                    objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Summarize this customer request: {{ticketText}}"
                      className="min-h-[120px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The prompt to send to the model. Use {"{{variables}}"} for
                    simple values or {"{{json variable}}"} to stringify objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
