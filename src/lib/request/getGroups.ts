import { api } from "@/lib/request/api";
import type { GetGroupsResponse } from "@/types/group";

export async function getGroups(): Promise<GetGroupsResponse> {
  return api("/api/groups");
}

// import { api } from "@/lib/api";
// import type { GroupSummary, PaginatedResponse } from "@/types/group";

// /**
//  * 呼叫後端 API `/api/groups`，支援分頁、排序
//  */
// export async function getGroups(options?: {
//   page?: number;
//   size?: number;
//   sort?: "asc" | "desc";
//   sortBy?: keyof GroupSummary;
// }): Promise<PaginatedResponse<GroupSummary>> {
//   const query = new URLSearchParams();

//   if (options?.page) query.set("page", options.page.toString());
//   if (options?.size) query.set("size", options.size.toString());
//   if (options?.sort) query.set("sort", options.sort);
//   if (options?.sortBy) query.set("sortBy", options.sortBy);

//   const path = query.toString() ? `/api/groups?${query}` : "/api/groups";

//   return api<PaginatedResponse<GroupSummary>>(path);
// }
