import { api } from "@/lib/api";
import type { GroupDetail } from "@/types/group";

export async function getGroupById(id: string): Promise<GroupDetail> {
  return api(`/api/groups/${id}`);
}

// // src/api/groups/getGroupById.ts

// import { mockGroups } from "@/lib/mockGroups";
// import type { GroupSummary } from "@/types/group";

// export async function getGroupById(id: string): Promise<GroupSummary> {
//   await new Promise((res) => setTimeout(res, 500)); // 模擬延遲

//   const group = mockGroups.find((g) => g.id === id);
//   if (!group) throw new Error("Group not found");

//   return {
//     id: group.id,
//     title: group.title,
//     description: group.description,
//     isArchived: group.isArchived,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     me: {
//       role: {
//         id: "mock-role-id",
//         role: "Organizer",
//         accessLevel: "Organizer",
//       },
//     },
//   };
// }
