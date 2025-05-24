import { api } from "@/lib/api";

export async function removeMember(
  groupId: string,
  memberId: string,
): Promise<void> {
  return api(`/api/groups/${groupId}/members/${memberId}`, {
    method: "DELETE",
  });
}

// // src/api/groups/removeMember.ts

// import { mockGroups } from "@/lib/mockGroups";

// export async function removeMember(
//   groupId: string,
//   memberId: string,
// ): Promise<{ success: boolean }> {
//   await new Promise((r) => setTimeout(r, 300)); // 模擬延遲

//   const group = mockGroups.find((g) => g.id === groupId);
//   if (!group) throw new Error("Group not found");

//   const index = group.members.findIndex((m) => m.id === memberId);
//   if (index === -1) throw new Error("Member not found");

//   group.members.splice(index, 1);
//   group.updatedAt = new Date().toISOString();

//   return { success: true };
// }
