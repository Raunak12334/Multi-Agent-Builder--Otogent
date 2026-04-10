"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseExecutionNode } from "./base-execution-node";

interface Props extends NodeProps<Node> {
  title: string;
  icon?: string;
}

export const GenericIntegrationNode = memo((props: Props) => {
  return (
    <BaseExecutionNode
      {...props}
      id={props.id}
      icon={props.icon || "/logos/logo.svg"}
      name={props.title}
      description="Click to configure integration"
      onSettings={() => {}}
    />
  );
});

GenericIntegrationNode.displayName = "GenericIntegrationNode";
