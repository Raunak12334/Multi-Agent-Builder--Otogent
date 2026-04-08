"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { ShieldCheckIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { HumanApprovalDialog, type HumanApprovalFormValues } from "./dialog";

type HumanApprovalNodeData = {
  variableName?: string;
  message?: string;
};

type HumanApprovalNodeType = Node<HumanApprovalNodeData>;

export const HumanApprovalNode = memo(
  (props: NodeProps<HumanApprovalNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleSubmit = (values: HumanApprovalFormValues) => {
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

    const description = props.data.message
      ? props.data.message.slice(0, 50)
      : "Not configured";

    return (
      <>
        <HumanApprovalDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultValues={props.data}
        />
        <BaseExecutionNode
          {...props}
          id={props.id}
          icon={ShieldCheckIcon}
          name="Human Approval"
          description={description}
          onSettings={() => setDialogOpen(true)}
          onDoubleClick={() => setDialogOpen(true)}
        />
      </>
    );
  },
);

HumanApprovalNode.displayName = "HumanApprovalNode";
