import type { PaginatedResponse } from "@/types/generic";
import type {
  AddLinuxGroupMembersRequest,
  AddLinuxGroupMembersResult,
  GetLinuxGroupMembersRequest,
  GetLinuxGroupMembersResponse,
  GetLinuxGroupsRequest,
  GetLinuxGroupsResponse,
  RemoveLinuxGroupMemberRequest,
} from "@/types/linuxGroup";
import {
  addMockGroupMembers,
  listMockGroupMembers,
  listMockGroups,
  removeMockGroupMember,
} from "@/lib/mocks/linuxGroupData";

/**
 * Linux group membership requests.
 *
 * TODO: the backend endpoints are not specified yet. Every function below is
 * wired to `lib/mocks/linuxGroupData.ts`; once the API spec lands, replace the
 * mock call with the `api()` call shown above it and delete the mock import.
 * The request/response types in `types/linuxGroup.ts` are the contract these
 * are written against, so callers should not need to change.
 */

export const linuxGroupQueryKeys = {
  all: ["linuxGroups"] as const,
  list: (search?: string) => ["linuxGroups", "list", search ?? ""] as const,
  members: (name: string) => ["linuxGroups", name, "members"] as const,
  memberPage: (name: string, page: number) =>
    ["linuxGroups", name, "members", page] as const,
};

const MOCK_LATENCY_MS = 300;

function mockResponse<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(value), MOCK_LATENCY_MS),
  );
}

function paginate<T>(items: T[], page: number, size: number) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / size));
  const start = page * size;

  return {
    items: items.slice(start, start + size),
    currentPage: page,
    pageSize: size,
    totalItems,
    totalPages,
    hasNextPage: start + size < totalItems,
  } satisfies PaginatedResponse<T>;
}

export async function getLinuxGroups(
  params: GetLinuxGroupsRequest = {},
): Promise<GetLinuxGroupsResponse> {
  const { page = 0, size = 20, search } = params;

  // const query = new URLSearchParams({
  //   page: page.toString(),
  //   size: size.toString(),
  // });
  // if (search) query.append("search", search);
  // return api<GetLinuxGroupsResponse>(`/api/linuxGroups?${query.toString()}`);
  return mockResponse(paginate(listMockGroups(search), page, size));
}

export async function getLinuxGroupMembers(
  params: GetLinuxGroupMembersRequest,
): Promise<GetLinuxGroupMembersResponse> {
  const { name, page = 0, size = 10 } = params;

  // const query = new URLSearchParams({
  //   page: page.toString(),
  //   size: size.toString(),
  // });
  // return api<GetLinuxGroupMembersResponse>(
  //   `/api/linuxGroups/${encodeURIComponent(name)}/members?${query.toString()}`,
  // );
  return mockResponse(paginate(listMockGroupMembers(name), page, size));
}

export async function addLinuxGroupMembers({
  name,
  members,
}: AddLinuxGroupMembersRequest): Promise<AddLinuxGroupMembersResult> {
  // return api<AddLinuxGroupMembersResult>(
  //   `/api/linuxGroups/${encodeURIComponent(name)}/members`,
  //   { method: "POST", body: JSON.stringify({ members }) },
  // );
  return mockResponse(addMockGroupMembers(name, members));
}

export async function removeLinuxGroupMember({
  name,
  memberId,
}: RemoveLinuxGroupMemberRequest): Promise<{ message: string }> {
  // return api<{ message: string }>(
  //   `/api/linuxGroups/${encodeURIComponent(name)}/members/${memberId}`,
  //   { method: "DELETE" },
  // );
  removeMockGroupMember(name, memberId);
  return mockResponse({ message: "success" });
}
