import { toast } from "sonner";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  transferGroupOwner,
  type TransferGroupOwnershipRequest,
} from "@/lib/request/transferGroupOwner";

export function useTransferGroupOwner(
  groupId: string,
  options?: UseMutationOptions<unknown, Error, TransferGroupOwnershipRequest>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferGroupOwnershipRequest) =>
      transferGroupOwner(groupId, data),
    onSuccess: (data, variables, context) => {
      toast.success("Transfer successful");
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Transfer failed");
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
