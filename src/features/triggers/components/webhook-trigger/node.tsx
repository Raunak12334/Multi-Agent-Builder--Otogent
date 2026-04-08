import type { NodeProps } from "@xyflow/react";
import { WebhookIcon } from "lucide-react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { WEBHOOK_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/webhook-trigger";
import { BaseTriggerNode } from "../base-trigger-node";
import { fetchWebhookTriggerRealtimeToken } from "./actions";
import { WebhookTriggerDialog } from "./dialog";

export const WebhookTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: WEBHOOK_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchWebhookTriggerRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <WebhookTriggerDialog
        nodeId={props.id}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <BaseTriggerNode
        {...props}
        icon={WebhookIcon}
        name="Webhook"
        description="When this URL gets a request"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

WebhookTriggerNode.displayName = "WebhookTriggerNode";
