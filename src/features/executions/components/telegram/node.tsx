"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { SendIcon } from "lucide-react";
import { memo, useState } from "react";
import { TELEGRAM_CHANNEL_NAME } from "@/inngest/channels/telegram";
import { useNodeStatus } from "../../hooks/use-node-status";
import { BaseExecutionNode } from "../base-execution-node";
import { TelegramDialog, type TelegramFormValues } from "./dialog";

type TelegramNodeData = {
  text?: string;
};

type TelegramNodeType = Node<TelegramNodeData>;

import { fetchTelegramRealtimeToken } from "../../actions";

export const TelegramNode = memo((props: NodeProps<TelegramNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: TELEGRAM_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchTelegramRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: TelegramFormValues) => {
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
      <TelegramDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={props.data}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={SendIcon}
        name="Telegram"
        status={nodeStatus}
        description={
          props.data?.text
            ? `Message: ${props.data.text.slice(0, 30)}...`
            : "Not configured"
        }
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

TelegramNode.displayName = "TelegramNode";
