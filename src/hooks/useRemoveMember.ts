import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMember } from "@/lib/request/removeMember";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type UseRemoveMemberOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: unknown) => void;
};

type Ctx = { toastId: string };

export function useRemoveMember(
  groupId: string,
  options?: UseRemoveMemberOptions,
) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, unknown, string, Ctx>({
    mutationFn: (memberId: string) => removeMember(groupId, memberId),
    onMutate: (memberId) => {
      const toastId = `remove-member-${groupId}-${memberId}`;
      toast.loading(
        t("groupComponents.memberDeleteButton.removingToast", "Removing..."),
        { id: toastId },
      );
      return { toastId };
    },
    onSuccess: async (_data, _memberId, ctx) => {
      toast.success(
        t(
          "groupComponents.memberDeleteButton.removeSuccessToast",
          "Member removed",
        ),
        { id: ctx?.toastId }, // 用同一個 id 取代 loading
      );
      await options?.onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["group-members", groupId] });
    },
    onError: (err, _memberId, ctx) => {
      const msg =
        (err as any)?.detail ||
        (err as Error)?.message ||
        t(
          "groupComponents.memberDeleteButton.removeFailToast",
          "Failed to remove member",
        );
      toast.error(msg, { id: ctx?.toastId });
      options?.onError?.(err);
    },
  });
}
