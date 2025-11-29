import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  transferGroupOwner,
  type TransferGroupOwnershipRequest,
} from "@/lib/request/transferGroupOwner";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useTransferGroupOwner(
  groupId: string,
  options?: UseMutationOptions<
    unknown,
    Error,
    TransferGroupOwnershipRequest,
    string
  >,
) {
  const { t } = useTranslation();

  return useMutation({
    ...options,

    mutationFn: (data: TransferGroupOwnershipRequest) =>
      transferGroupOwner(groupId, data),

    onMutate: () => {
      const toastId = `transfer-owner-${groupId}`;
      toast.loading(
        t("groupSettings.transferOwnership.transferring", "Transferring..."),
        { id: toastId },
      );
      return toastId;
    },

    onSuccess: (data, vars, ctx) => {
      toast.success(
        t(
          "groupSettings.transferOwnership.success",
          "Ownership transferred successfully.",
        ),
        { id: ctx },
      );
      options?.onSuccess?.(data, vars, ctx);
    },

    onError: (err, vars, ctx) => {
      const msg =
        err.message ||
        t(
          "groupSettings.transferOwnership.failed",
          "Failed to transfer ownership.",
        );
      toast.error(msg, { id: ctx });
      options?.onError?.(err, vars, ctx);
    },
  });
}
