"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { BracesIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { JsonTransformDialog, type JsonTransformFormValues } from "./dialog";

type JsonTransformNodeData = {
  variableName?: string;
  template?: string;
};

type JsonTransformNodeType = Node<JsonTransformNodeData>;

export const JsonTransformNode = memo(
  (props: NodeProps<JsonTransformNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: JsonTransformFormValues) => {
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
    const description = nodeData?.variableName
      ? `Save ${nodeData.variableName}`
      : "Not configured";

    return (
      <>
        <JsonTransformDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
        />
        <BaseExecutionNode
          {...props}
          id={props.id}
          icon={BracesIcon}
          name="JSON Transform"
          description={description}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </>
    );
  },
);

JsonTransformNode.displayName = "JsonTransformNode";
