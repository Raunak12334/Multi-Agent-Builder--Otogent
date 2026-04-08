"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { Clock3Icon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { DelayDialog, type DelayFormValues } from "./dialog";

type DelayNodeData = {
  amount?: number;
  unit?: "s" | "m" | "h";
};

type DelayNodeType = Node<DelayNodeData>;

export const DelayNode = memo((props: NodeProps<DelayNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: DelayFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id
          ? {
              ...node,
              data: {
                ...node.data,
                ...values,
              },
            }
          : node,
      ),
    );
  };

  const amount = props.data.amount ?? 5;
  const unit = props.data.unit || "s";
  const unitLabel =
    unit === "h" ? "hour(s)" : unit === "m" ? "minute(s)" : "second(s)";

  return (
    <>
      <DelayDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={props.data}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={Clock3Icon}
        name="Delay"
        description={`Wait ${amount} ${unitLabel}`}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

DelayNode.displayName = "DelayNode";
