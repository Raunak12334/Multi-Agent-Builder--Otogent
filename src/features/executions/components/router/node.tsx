"use client";

import {
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
} from "@xyflow/react";
import { GitBranchPlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { WorkflowNode } from "@/components/workflow-node";
import { RouterDialog, type RouterFormValues } from "./dialog";

type RouterNodeData = {
  variableName?: string;
  routeExpression?: string;
  routes?: string[];
  fallbackRoute?: string;
};

type RouterNodeType = Node<RouterNodeData>;

export const RouterNode = memo((props: NodeProps<RouterNodeType>) => {
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

  const handleSubmit = (values: RouterFormValues) => {
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

  const routes = props.data.routes?.filter(Boolean) ?? ["success", "failure"];
  const description = props.data.routeExpression
    ? props.data.routeExpression.slice(0, 50)
    : "Not configured";

  return (
    <>
      <RouterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={props.data}
      />
      <WorkflowNode
        name="Router"
        description={description}
        onDelete={handleDelete}
        onSettings={() => setDialogOpen(true)}
      >
        <BaseNode onDoubleClick={() => setDialogOpen(true)}>
          <BaseNodeContent className="min-w-44">
            <GitBranchPlusIcon className="size-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Routes by named branch
            </p>
            <BaseHandle id="main" type="target" position={Position.Left} />
            {routes.map((route, index) => (
              <BaseHandle
                key={route}
                id={route}
                type="source"
                position={Position.Right}
                style={{
                  top: 28 + index * 26,
                }}
              >
                <span className="absolute right-4 text-[10px] text-muted-foreground whitespace-nowrap">
                  {route}
                </span>
              </BaseHandle>
            ))}
          </BaseNodeContent>
        </BaseNode>
      </WorkflowNode>
    </>
  );
});

RouterNode.displayName = "RouterNode";
