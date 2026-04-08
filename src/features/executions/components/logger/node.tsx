"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { FileTextIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { LoggerDialog, type LoggerFormValues } from "./dialog";

type LoggerNodeData = {
  level?: "info" | "warn" | "error";
  message?: string;
  variableName?: string;
};

type LoggerNodeType = Node<LoggerNodeData>;

export const LoggerNode = memo((props: NodeProps<LoggerNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: LoggerFormValues) => {
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

  const nodeData = props.data;
  const description = nodeData?.message
    ? nodeData.message.slice(0, 50)
    : "Not configured";

  return (
    <>
      <LoggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={FileTextIcon}
        name="Logger"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

LoggerNode.displayName = "LoggerNode";
