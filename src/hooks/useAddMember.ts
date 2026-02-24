import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMember } from "@/lib/request/addMember";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { AddGroupMemberInput, AddMembersResult } from "@/types/group";
import { ApiError } from "@/types/generic";

type UseAddMemberOptions = {
  onSuccess?: (data: AddMembersResult) => void | Promise<void>;
  onError?: (err: ApiError) => void;
};

export function useAddMember(groupId: string, options?: UseAddMemberOptions) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (members: AddGroupMemberInput[]) => addMember(groupId, members),

    onSuccess: async (data, variables) => {
      const { addedSuccessNumber, addedFailureNumber } = data;
      const total = variables.length;

      // all success
      if (addedFailureNumber === 0) {
        toast.success(
          t("groupPages.addMemberPage.toastAllSuccess", {
            success: addedSuccessNumber,
            total,
          }),
          { id: "add-member-summary" },
        );
      }
      // partial success
      else {
        toast.error(
          t("groupPages.addMemberPage.toastPartialSuccess", {
            success: addedSuccessNumber,
            total,
            fail: addedFailureNumber,
          }),
          { id: "add-member-summary" },
        );
      }
      await options?.onSuccess?.(data);
      queryClient.invalidateQueries({ queryKey: ["GroupMember", groupId] });
    },
    onError: (err: ApiError, variables) => {
      const errorData = err.data as AddMembersResult;
      const total = variables.length;
      // all fail
      if (errorData?.addedFailureNumber > 0) {
        toast.error(
          t("groupPages.addMemberPage.toastAllFail", {
            fail: errorData.addedFailureNumber,
            total,
          }),
          { id: "add-member-error" },
        );
      } else {
        // network or unexpected error
        toast.error(t("groupPages.addMemberPage.toastFail"), {
          id: "add-member-error",
        });
      }
      options?.onError?.(err);
    },
  });
}
