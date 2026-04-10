"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { LinkedinDialog, LinkedinFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { LINKEDIN_CHANNEL_NAME } from "@/inngest/channels/linkedin";
import { LinkedinIcon } from "lucide-react";

type LinkedinNodeData = {
  content?: string;
};

type LinkedinNodeType = Node<LinkedinNodeData>;

import { fetchLinkedinRealtimeToken } from "../../actions";

export const LinkedinNode = memo((props: NodeProps<LinkedinNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: LINKEDIN_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchLinkedinRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: LinkedinFormValues) => {
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
      <LinkedinDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={props.data}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={LinkedinIcon}
        name="LinkedIn"
        status={nodeStatus}
        description={props.data?.content ? `Post: ${props.data.content.slice(0, 30)}...` : "Not configured"}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

LinkedinNode.displayName = "LinkedinNode";
