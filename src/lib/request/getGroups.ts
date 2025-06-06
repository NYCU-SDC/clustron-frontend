import { api } from "@/lib/request/api";
import type { GetGroupsResponse } from "@/types/group";

export async function getGroups(): Promise<GetGroupsResponse> {
  return api("/api/groups");
}
