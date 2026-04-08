"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { TypeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { TextTemplateDialog, type TextTemplateFormValues } from "./dialog";

type TextTemplateNodeData = {
  variableName?: string;
  template?: string;
};

type TextTemplateNodeType = Node<TextTemplateNodeData>;

export const TextTemplateNode = memo(
  (props: NodeProps<TextTemplateNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: TextTemplateFormValues) => {
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
        <TextTemplateDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={nodeData}
        />
        <BaseExecutionNode
          {...props}
          id={props.id}
          icon={TypeIcon}
          name="Text Template"
          description={description}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </>
    );
  },
);

TextTemplateNode.displayName = "TextTemplateNode";
