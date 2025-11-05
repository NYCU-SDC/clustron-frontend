import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "@/lib/request/createGroup";
import type { CreateGroupInput, CreateGroupResponse } from "@/types/group";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useCreateGroup(options?: {
  onSuccess?: (data: CreateGroupResponse) => void;
  onError?: (err: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const toastId = "create-group";

  return useMutation<CreateGroupResponse, unknown, CreateGroupInput>({
    mutationFn: createGroup,
    onMutate: () => {
      toast.loading(t("groupPages.createGroup.creatingToast", "Creating..."), {
        id: toastId,
      });
    },
    onSuccess: (data) => {
      toast.success(
        t(
          "groupPages.createGroup.createSuccessToast",
          "Group created successfully",
        ),
        { id: toastId },
      );
      queryClient.invalidateQueries({ queryKey: ["groups"] as const });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      const msg =
        (err as any)?.detail ||
        (err as Error)?.message ||
        t("groupPages.createGroup.createFailToast", "Failed to create group");
      toast.error(msg, { id: toastId });
      options?.onError?.(err);
    },
  });
}
