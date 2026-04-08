"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { HUGGINGFACE_CHANNEL_NAME } from "@/inngest/channels/huggingface";
import { useNodeStatus } from "../../hooks/use-node-status";
import { BaseExecutionNode } from "../base-execution-node";
import { fetchHuggingFaceRealtimeToken } from "./actions";
import { HuggingFaceDialog, type HuggingFaceFormValues } from "./dialog";

type HuggingFaceNodeData = {
  variableName?: string;
  credentialId?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

type HuggingFaceNodeType = Node<HuggingFaceNodeData>;

export const HuggingFaceNode = memo((props: NodeProps<HuggingFaceNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: HUGGINGFACE_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchHuggingFaceRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: HuggingFaceFormValues) => {
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
  const description = nodeData?.userPrompt
    ? `${nodeData.model || "Hugging Face"}: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <HuggingFaceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/huggingface.svg"
        name="Hugging Face"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

HuggingFaceNode.displayName = "HuggingFaceNode";
