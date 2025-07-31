import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  transferGroupOwner,
  type TransferGroupOwnershipRequest,
} from "@/lib/request/transferGroupOwner";

export function useTransferGroupOwner(
  groupId: string,
  options?: UseMutationOptions<unknown, Error, TransferGroupOwnershipRequest>,
) {
  return useMutation({
    mutationFn: (data: TransferGroupOwnershipRequest) =>
      transferGroupOwner(groupId, data),

    ...options,
  });
}
