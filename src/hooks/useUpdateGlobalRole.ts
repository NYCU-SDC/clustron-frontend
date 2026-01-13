import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGlobalRole } from "@/lib/request/updateGlobalRole";
import type { UpdateUserRoleInput } from "@/types/admin";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useUpdateGlobalRole() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (input: UpdateUserRoleInput) => updateGlobalRole(input),
    onMutate: (input) => {
      const toastId = `update-global-role-${input.id}`;
      toast.loading(t("userConfigTable.updatingToast", "Updating..."), {
        id: toastId,
      });
      return toastId;
    },

    onSuccess: (_data, _vars, ctx) => {
      toast.success(t("userConfigTable.updateSuccessToast", "Role updated"), {
        id: ctx,
      });
      queryClient.invalidateQueries({
        queryKey: ["AdminUsers"],
      });
    },
    onError: (err, _vars, ctx) => {
      const msg =
        err instanceof Error
          ? err.message
          : t("userConfigTable.updateFailToast", "Failed to update role");
      toast.error(msg, { id: ctx });
    },
  });
}
