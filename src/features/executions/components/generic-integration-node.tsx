"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { nodeCatalog } from "@/config/node-catalog";
import { BaseExecutionNode } from "./base-execution-node";

interface Props extends NodeProps<Node> {
  title: string;
  icon?: string;
}

type FormDataValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<unknown>
  | Record<string, unknown>;

type FormDataState = Record<string, FormDataValue>;

export const GenericIntegrationNode = memo((props: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const catalogItem = Object.values(nodeCatalog).find(
    (item) => item.type === props.type,
  );

  const [formData, setFormData] = useState<FormDataState>({});

  useEffect(() => {
    if (dialogOpen) {
      setFormData((props.data as FormDataState | undefined) ?? {});
    }
  }, [dialogOpen, props.data]);

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...formData,
            },
          };
        }
        return node;
      }),
    );
    setDialogOpen(false);
  };

  const handleChange = (key: string, value: FormDataValue) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const nodeData = props.data;
  const variableName =
    typeof nodeData?.variableName === "string" ? nodeData.variableName : null;
  const description = variableName
    ? `Reference as {{${variableName}}}`
    : catalogItem?.description || "Click to configure";
  const getFieldValue = (key: string) => {
    const value = formData[key];

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    return "";
  };
  const variableInputId = `${props.id}-variable-name`;

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{props.title} Configuration</DialogTitle>
            <DialogDescription>
              Configure settings for the {props.title} node.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium" htmlFor={variableInputId}>
                Variable Name
              </Label>
              <Input
                id={variableInputId}
                placeholder="myIntegration"
                value={getFieldValue("variableName")}
                onChange={(e) => handleChange("variableName", e.target.value)}
              />
              <p className="text-xs text-slate-500">
                Use this name to reference the result in other nodes, e.g.,{" "}
                {"{{myIntegration.result}}"}
              </p>
            </div>

            {catalogItem?.inputs.map((input) => {
              const inputId = `${props.id}-${input.key}`;

              return (
                <div key={input.key} className="space-y-1">
                  <Label
                    className="text-sm font-medium flex items-center gap-2"
                    htmlFor={inputId}
                  >
                    {input.label}
                    {input.required && <span className="text-rose-500">*</span>}
                  </Label>

                  {input.type === "textarea" ? (
                    <Textarea
                      id={inputId}
                      placeholder={input.placeholder || ""}
                      value={getFieldValue(input.key)}
                      className="min-h-[80px] font-mono text-sm"
                      onChange={(e) => handleChange(input.key, e.target.value)}
                      required={input.required}
                    />
                  ) : input.type === "select" ? (
                    <select
                      id={inputId}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={getFieldValue(input.key)}
                      onChange={(e) => handleChange(input.key, e.target.value)}
                      required={input.required}
                    >
                      <option value="" disabled>
                        Select option
                      </option>
                      {input.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={inputId}
                      type={input.type === "number" ? "number" : "text"}
                      placeholder={
                        input.placeholder ||
                        `Enter ${input.label.toLowerCase()}`
                      }
                      value={getFieldValue(input.key)}
                      onChange={(e) => handleChange(input.key, e.target.value)}
                      required={input.required}
                    />
                  )}

                  {input.supportsDynamic && (
                    <p className="text-[10px] text-blue-500 uppercase font-black uppercase tracking-widest mt-1">
                      Supports {"{{dynamic}}"} variables
                    </p>
                  )}
                </div>
              );
            })}

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Settings</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <BaseExecutionNode
        {...props}
        id={props.id}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

GenericIntegrationNode.displayName = "GenericIntegrationNode";
