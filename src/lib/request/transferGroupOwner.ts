import { api } from "@/lib/request/api";

export type TransferGroupOwnershipRequest = {
  identifier: string;
};

export async function transferGroupOwner(
  groupId: string,
  body: TransferGroupOwnershipRequest,
) {
  return api(`/api/groups/${groupId}/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
