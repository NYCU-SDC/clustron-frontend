import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMember } from "@/lib/request/addMember";
import type {
  AddGroupMemberInput,
  AddGroupMemberResponse,
} from "@/types/group";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type UseAddMemberOptions = {
  onSuccess?: (data: AddGroupMemberResponse[]) => void | Promise<void>;
  onError?: (err: unknown) => void;
};

function summarize(data: AddGroupMemberResponse[]) {
  const norm = (r: any) => {
    const s = (r?.status ?? r?.result ?? (r?.ok ? "success" : undefined)) as
      | string
      | undefined;
    return (s ?? "success").toLowerCase();
  };

  const total = data.length;
  let success = 0;
  let warning = 0;
  let fail = 0;

  for (const r of data) {
    const s = norm(r);
    if (s === "success") success++;
    else if (s === "warning" || s === "pending") warning++;
    else fail++;
  }
  return { total, success, warning, fail };
}

export function useAddMember(groupId: string, options?: UseAddMemberOptions) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (members: AddGroupMemberInput[]) => addMember(groupId, members),

    onSuccess: async (data) => {
      const { total, success, warning, fail } = summarize(data);

      if (fail === 0 && warning === 0) {
        toast.success(
          t(
            "groupPages.addMemberPage.toastAllSuccess",
            "{{success}}/{{total}} members added successfully",
            { success, total },
          ),
          { id: "add-member-summary" },
        );
      } else if (fail > 0 && success === 0 && warning === 0) {
        toast.error(
          t(
            "groupPages.addMemberPage.toastAllFail",
            "Adding members failed ({{fail}}/{{total}} failed)",
            { fail, total },
          ),
          { id: "add-member-summary" },
        );
      } else {
        toast.warning(
          t(
            "groupPages.addMemberPage.toastPartial",
            "{{success}} success, {{warning}} pending, {{fail}} failed (total {{total}})",
            { success, warning, fail, total },
          ),
          { id: "add-member-summary" },
        );
      }
      await options?.onSuccess?.(data);
      queryClient.invalidateQueries({ queryKey: ["group-members", groupId] });
    },
    onError: (err) => {
      const msg =
        (err as any)?.detail ||
        (err as Error)?.message ||
        t("groupPages.addMemberPage.toastFail", "Failed to add members");
      toast.error(msg, { id: "add-member-error" });
      options?.onError?.(err);
    },
  });
}
