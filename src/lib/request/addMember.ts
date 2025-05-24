import { api } from "@/lib/api";
import type {
  AddGroupMemberInput,
  AddGroupMemberResponse,
} from "@/types/group";

export async function addMember(
  groupId: string,
  members: AddGroupMemberInput[],
): Promise<AddGroupMemberResponse[]> {
  return api(`/api/groups/${groupId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(members),
  });
}

// // src/api/groups/addMember.ts

// import { mockGroups } from "@/lib/mockGroups";
// import type { Member } from "@/lib/mockGroups";
// import { mockUsers } from "@/lib/userMock";

// type AddMemberRequest = {
//   member: string; // email or studentId
//   role: string;
// };

// type AddMemberResponse = {
//   id: string;
//   username: string;
//   email: string;
//   studentId: string;
//   role: {
//     id: string;
//     role: string;
//     accessLevel: Member["accessLevel"];
//   };
// };

// function generateMember(input: string, role: string): Member {
//   const user = mockUsers.find(
//     (user) => user.studentId === input || user.email === input,
//   );

//   if (!user) {
//     throw new Error(`User with ${input} not found`);
//   }

//   const accessLevel =
//     role === "Teacher"
//       ? "organizer"
//       : role === "Teacher assistant"
//         ? "groupAdmin"
//         : "user";

//   return {
//     id: user.id,
//     username: user.username,
//     email: user.email,
//     studentId: user.studentId,
//     role: role as Member["role"],
//     accessLevel,
//   };
// }

// export async function addMember(
//   groupId: string,
//   input: AddMemberRequest[],
// ): Promise<AddMemberResponse[]> {
//   await new Promise((r) => setTimeout(r, 300));

//   const group = mockGroups.find((g) => g.id === groupId);
//   if (!group) throw new Error("Group not found");

//   const newMembers = input.map((entry) =>
//     generateMember(entry.member, entry.role),
//   );

//   // 避免加入重複 email
//   const existing = new Set(group.members.map((m) => m.email));
//   const filtered = newMembers.filter((m) => !existing.has(m.email));
//   group.members.push(...filtered);
//   group.updatedAt = new Date().toISOString();

//   return filtered.map((m) => ({
//     id: m.id,
//     username: m.username,
//     email: m.email,
//     studentId: m.studentId,
//     role: {
//       id: `role-${m.id}`,
//       role: m.role,
//       accessLevel: m.accessLevel,
//     },
//   }));
// }
