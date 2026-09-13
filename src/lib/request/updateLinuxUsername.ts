import { api } from "@/lib/request/api";
import type {
  UpdateLinuxUsernameRequest,
  UpdateLinuxUsernameResponse,
} from "@/types/admin";

export async function updateLinuxUsername({
  id,
  linuxUsername,
}: UpdateLinuxUsernameRequest): Promise<UpdateLinuxUsernameResponse> {
  return api<UpdateLinuxUsernameResponse>(`/api/users/${id}/ldapBind`, {
    method: "PUT",
    body: JSON.stringify({ linuxUsername }),
  });
}
