"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { VariableIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { SetVariableDialog, type SetVariableFormValues } from "./dialog";

type SetVariableNodeData = {
  variableName?: string;
  valueTemplate?: string;
  parseAsJson?: boolean;
};

type SetVariableNodeType = Node<SetVariableNodeData>;

export const SetVariableNode = memo((props: NodeProps<SetVariableNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: SetVariableFormValues) => {
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
    ? `Set ${nodeData.variableName}`
    : "Not configured";

  return (
    <>
      <SetVariableDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={VariableIcon}
        name="Set Variable"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

SetVariableNode.displayName = "SetVariableNode";
