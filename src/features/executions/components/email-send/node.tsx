"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";

export const EmailSendNode = memo((props: NodeProps<Node>) => {
  const [_dialogOpen, setDialogOpen] = useState(false);

  return (
    <BaseExecutionNode
      {...props}
      id={props.id}
      icon="/logos/email.svg"
      name="Send Email"
      description={
        props.data?.subject ? `To: ${props.data.to}` : "Configure email..."
      }
      onSettings={() => setDialogOpen(true)}
    />
  );
});

EmailSendNode.displayName = "EmailSendNode";
