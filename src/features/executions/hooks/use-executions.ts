import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useExecutionsParams } from "./use-executions-params";

/**
 * Hook to fetch all executions using suspense
 */
export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionsParams();

  return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
};

/**
 * Hook to fetch a single execution using suspense
 */
export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};

export const useResumeExecution = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.executions.resume.mutationOptions({
      onSuccess: (data) => {
        toast.success("Execution resumed");
        queryClient.invalidateQueries(
          trpc.executions.getOne.queryOptions({ id: data.id }),
        );
        queryClient.invalidateQueries(trpc.executions.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to resume execution: ${error.message}`);
      },
    }),
  );
};

export const useReplayExecutionCheckpoint = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.executions.replayFromCheckpoint.mutationOptions({
      onSuccess: () => {
        toast.success("Checkpoint replay started");
        queryClient.invalidateQueries(trpc.executions.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to replay checkpoint: ${error.message}`);
      },
    }),
  );
};

export const useApproveExecution = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.executions.approve.mutationOptions({
      onSuccess: (data) => {
        toast.success("Execution approved");
        queryClient.invalidateQueries(
          trpc.executions.getOne.queryOptions({ id: data.id }),
        );
        queryClient.invalidateQueries(trpc.executions.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to approve execution: ${error.message}`);
      },
    }),
  );
};
