import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/request/api";

export function useTransferGroupOwner(groupId: string, onSuccess?: () => void) {
  return useMutation({
    mutationFn: (data: { identifier: string }) =>
      api(`/api/groups/${groupId}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess,
  });
}
