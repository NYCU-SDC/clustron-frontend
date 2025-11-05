import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupLink } from "@/lib/request/groupLinks";
import type { GroupLinkPayload, GroupLinkResponse } from "@/types/group";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getErrMessage } from "@/lib/errors";

type Vars = { groupId: string; payload: GroupLinkPayload };

type Ctx = { toastId: string };

export function useCreateGroupLink(options?: {
  onSuccess?: (data: GroupLinkResponse) => void;
  onError?: (err: unknown) => void;
}) {
  const qc = useQueryClient();
  const { t } = useTranslation();

  return useMutation<GroupLinkResponse, unknown, Vars, Ctx>({
    mutationFn: createGroupLink,
    mutationKey: ["GroupLinks", "create"],
    onMutate: (vars) => {
      const toastId = `create-group-link-${vars.groupId}`;
      toast.loading(
        t("groupPages.groupLinks.creatingToast", "Creating link..."),
        { id: toastId },
      );
      return { toastId };
    },
    onSuccess: (data, vars, ctx) => {
      toast.success(
        t(
          "groupPages.groupLinks.createSuccessToast",
          "Link created successfully",
        ),
        { id: ctx?.toastId },
      );
      qc.invalidateQueries({ queryKey: ["GroupLinks", vars.groupId] });
      options?.onSuccess?.(data);
    },
    onError: (err, _vars, ctx) => {
      const msg = getErrMessage(
        err,
        t("groupPages.groupLinks.createFailToast", "Failed to create link"),
      );
      toast.error(msg, { id: ctx?.toastId });
      options?.onError?.(err);
    },
  });
}
