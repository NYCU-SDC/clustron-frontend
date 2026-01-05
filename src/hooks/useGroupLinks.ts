import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupLink } from "@/lib/request/groupLinks";
import type { GroupLinkResponse } from "@/types/group";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useCreateGroupLink(options?: {
  onSuccess?: (data: GroupLinkResponse) => void;
  onError?: (err: Error) => void;
}) {
  const qc = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: createGroupLink,
    mutationKey: ["GroupLinks", "create"],
    onMutate: (vars) => {
      const toastId = `create-group-link-${vars.groupId}`;
      toast.loading(
        t("groupPages.groupLinks.creatingToast", "Creating link..."),
        { id: toastId },
      );
      return toastId;
    },
    onSuccess: (data, vars, ctx) => {
      toast.success(
        t(
          "groupPages.groupLinks.createSuccessToast",
          "Link created successfully",
        ),
        { id: ctx },
      );
      qc.invalidateQueries({ queryKey: ["GroupLinks", vars.groupId] });
      options?.onSuccess?.(data);
    },
    onError: (err, _vars, ctx) => {
      const msg =
        err.message ||
        t("groupPages.groupLinks.createFailToast", "Failed to create link");
      toast.error(msg, { id: ctx });
      options?.onError?.(err);
    },
  });
}
