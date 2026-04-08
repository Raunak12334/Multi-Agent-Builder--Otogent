"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { GitMergeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { MergeDialog } from "./dialog";

type MergeNodeType = Node<Record<string, never>>;

export const MergeNode = memo((props: NodeProps<MergeNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <MergeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GitMergeIcon}
        name="Merge"
        description="Join branches"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

MergeNode.displayName = "MergeNode";
