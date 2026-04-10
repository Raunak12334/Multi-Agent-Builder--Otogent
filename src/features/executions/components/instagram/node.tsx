"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { InstagramDialog, InstagramFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { INSTAGRAM_CHANNEL_NAME } from "@/inngest/channels/instagram";
import { InstagramIcon } from "lucide-react";

type InstagramNodeData = {
  caption?: string;
};

type InstagramNodeType = Node<InstagramNodeData>;

export const InstagramNode = memo((props: NodeProps<InstagramNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: INSTAGRAM_CHANNEL_NAME,
    topic: "status",
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
        icon={<InstagramIcon className="size-5 text-pink-600" />}
        name="Instagram"
        status={nodeStatus}
        description={props.data?.caption ? `Caption: ${props.data.caption.slice(0, 30)}...` : "Not configured"}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

InstagramNode.displayName = "InstagramNode";
