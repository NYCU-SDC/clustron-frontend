import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMember } from "@/lib/request/addMember";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getErrMessage } from "@/lib/errors";
import type { AddGroupMemberInput, GroupMember } from "@/types/group";

type UseAddMemberOptions = {
  onSuccess?: (data: GroupMember[]) => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useAddMember(groupId: string, options?: UseAddMemberOptions) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (members: AddGroupMemberInput[]) => addMember(groupId, members),

    onSuccess: async (data) => {
      const total = data.length;
      toast.success(
        t(
          "groupPages.addMemberPage.toastAllSuccess",
          "{{success}}/{{total}} members added successfully",
          { success: total, total },
        ),
        { id: "add-member-summary" },
      );
      await options?.onSuccess?.(data);
      queryClient.invalidateQueries({ queryKey: ["group-members", groupId] });
    },
    onError: (err) => {
      const msg = getErrMessage(
        err,
        t("groupPages.addMemberPage.toastFail", "Failed to add members"),
      );
      toast.error(msg, { id: "add-member-error" });
      options?.onError?.(err);
    },
  });
}
