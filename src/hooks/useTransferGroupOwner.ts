import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  transferGroupOwner,
  type TransferGroupOwnershipRequest,
} from "@/lib/request/transferGroupOwner";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type Ctx = { toastId: string };

export function useTransferGroupOwner(
  groupId: string,
  options?: UseMutationOptions<
    unknown,
    Error,
    TransferGroupOwnershipRequest,
    Ctx
  >,
) {
  const { t } = useTranslation();

  return useMutation<unknown, Error, TransferGroupOwnershipRequest, Ctx>({
    ...options,

    mutationFn: (data: TransferGroupOwnershipRequest) =>
      transferGroupOwner(groupId, data),

    onMutate: (_vars) => {
      const toastId = `transfer-owner-${groupId}`;
      toast.loading(
        t("groupSettings.transferOwnership.transferring", "Transferring..."),
        { id: toastId },
      );
      return { toastId };
    },

    onSuccess: (data, vars, ctx) => {
      toast.success(
        t(
          "groupSettings.transferOwnership.success",
          "Ownership transferred successfully.",
        ),
        { id: ctx?.toastId },
      );
      options?.onSuccess?.(data, vars, ctx);
    },

    onError: (err, vars, ctx) => {
      const msg =
        (err as any)?.detail ||
        (err as Error)?.message ||
        t(
          "groupSettings.transferOwnership.failed",
          "Failed to transfer ownership.",
        );
      toast.error(msg, { id: ctx?.toastId });
      options?.onError?.(err, vars, ctx);
    },
  });
}
