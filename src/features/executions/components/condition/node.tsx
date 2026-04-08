"use client";

import {
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
} from "@xyflow/react";
import { GitForkIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { WorkflowNode } from "@/components/workflow-node";
import { ConditionDialog, type ConditionFormValues } from "./dialog";

type ConditionNodeData = {
  variableName?: string;
  expression?: string;
  trueRoute?: string;
  falseRoute?: string;
};

type ConditionNodeType = Node<ConditionNodeData>;

export const ConditionNode = memo((props: NodeProps<ConditionNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setEdges, setNodes } = useReactFlow();

  const handleDelete = () => {
    setNodes((currentNodes) =>
      currentNodes.filter((node) => node.id !== props.id),
    );
    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) => edge.source !== props.id && edge.target !== props.id,
      ),
    );
  };

  const handleSubmit = (values: ConditionFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id
          ? {
              ...node,
              data: {
                ...node.data,
                ...values,
              },
            }
          : node,
      ),
    );
  };

  const trueRoute = props.data.trueRoute || "true";
  const falseRoute = props.data.falseRoute || "false";
  const description = props.data.expression
    ? props.data.expression.slice(0, 50)
    : "Not configured";

  return (
    <>
      <ConditionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={props.data}
      />
      <WorkflowNode
        name="Condition"
        description={description}
        onDelete={handleDelete}
        onSettings={() => setDialogOpen(true)}
      >
        <BaseNode onDoubleClick={() => setDialogOpen(true)}>
          <BaseNodeContent className="min-w-44">
            <GitForkIcon className="size-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">True / false branch</p>
            <BaseHandle id="main" type="target" position={Position.Left} />
            <BaseHandle
              id={trueRoute}
              type="source"
              position={Position.Right}
              style={{ top: 30 }}
            >
              <span className="absolute right-4 text-[10px] text-muted-foreground whitespace-nowrap">
                {trueRoute}
              </span>
            </BaseHandle>
            <BaseHandle
              id={falseRoute}
              type="source"
              position={Position.Right}
              style={{ top: 56 }}
            >
              <span className="absolute right-4 text-[10px] text-muted-foreground whitespace-nowrap">
                {falseRoute}
              </span>
            </BaseHandle>
          </BaseNodeContent>
        </BaseNode>
      </WorkflowNode>
    </>
  );
});

ConditionNode.displayName = "ConditionNode";
