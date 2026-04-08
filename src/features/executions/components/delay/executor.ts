import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";

type DelayData = {
  amount?: number;
  unit?: "s" | "m" | "h";
};

export const delayExecutor: NodeExecutor<DelayData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  const amount = data.amount ?? 0;
  const unit = data.unit || "s";

  if (amount <= 0) {
    throw new NonRetriableError("Delay node: Amount must be greater than zero");
  }

  await step.sleep(`delay-${nodeId}`, `${amount}${unit}`);

  return context;
};
