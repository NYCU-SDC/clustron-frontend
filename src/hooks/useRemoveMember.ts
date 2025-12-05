import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMember } from "@/lib/request/removeMember";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getErrMessage } from "@/lib/errors";

type UseRemoveMemberOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useRemoveMember(
  groupId: string,
  options?: UseRemoveMemberOptions,
) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (memberId: string) => removeMember(groupId, memberId),
    onMutate: (memberId) => {
      const toastId = `remove-member-${groupId}-${memberId}`;
      toast.loading(
        t("groupComponents.memberDeleteButton.removingToast", "Removing..."),
        { id: toastId },
      );
      return toastId;
    },
    onSuccess: async (_data, _memberId, ctx) => {
      toast.success(
        t(
          "groupComponents.memberDeleteButton.removeSuccessToast",
          "Member removed",
        ),
        { id: ctx },
      );
      await options?.onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["group-members", groupId] });
    },
    onError: (err) => {
      const msg = getErrMessage(err, "Failed to remove member");
      toast.error(msg, { id: "remove-member-error" });
      options?.onError?.(err);
    },
  });
}
