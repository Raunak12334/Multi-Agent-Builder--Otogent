"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { InstagramIcon } from "lucide-react";
import { memo, useState } from "react";
import { INSTAGRAM_CHANNEL_NAME } from "@/inngest/channels/instagram";
import { useNodeStatus } from "../../hooks/use-node-status";
import { BaseExecutionNode } from "../base-execution-node";
import { InstagramDialog, type InstagramFormValues } from "./dialog";

type InstagramNodeData = {
  caption?: string;
};

type InstagramNodeType = Node<InstagramNodeData>;

import { fetchInstagramRealtimeToken } from "../../actions";

export const InstagramNode = memo((props: NodeProps<InstagramNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: INSTAGRAM_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchInstagramRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: InstagramFormValues) => {
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

  return (
    <>
      <InstagramDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={props.data}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={InstagramIcon}
        name="Instagram"
        status={nodeStatus}
        description={
          props.data?.caption
            ? `Caption: ${props.data.caption.slice(0, 30)}...`
            : "Not configured"
        }
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

InstagramNode.displayName = "InstagramNode";
