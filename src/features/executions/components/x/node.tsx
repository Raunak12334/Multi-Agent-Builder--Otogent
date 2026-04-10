"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { TwitterIcon } from "lucide-react";
import { memo, useState } from "react";
import { X_CHANNEL_NAME } from "@/inngest/channels/x";
import { useNodeStatus } from "../../hooks/use-node-status";
import { BaseExecutionNode } from "../base-execution-node";
import { XDialog, type XFormValues } from "./dialog";

type XNodeData = {
  content?: string;
};

type XNodeType = Node<XNodeData>;

import { fetchXRealtimeToken } from "../../actions";

export const XNode = memo((props: NodeProps<XNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: X_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchXRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: XFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };

  const nodeData = props.data;
  const description = nodeData?.content
    ? `Tweet: ${nodeData.content.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <XDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={TwitterIcon}
        name="X (Twitter)"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

XNode.displayName = "XNode";
