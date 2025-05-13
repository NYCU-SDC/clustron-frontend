// src/api/groups/updateMember.ts

import { mockGroups } from "@/lib/mockGroups";
import type { Member } from "@/lib/mockGroups";

type UpdateMemberRequest = {
  id: string; // memberId（與 URL 一致）
  role: string;
};

type UpdateMemberResponse = {
  id: string;
  username: string;
  email: string;
  studentId: string;
  role: {
    id: string;
    role: string;
    accessLevel: Member["accessLevel"];
  };
};

export async function updateMember(
  groupId: string,
  memberId: string,
  payload: UpdateMemberRequest,
): Promise<UpdateMemberResponse> {
  await new Promise((r) => setTimeout(r, 300));

  const group = mockGroups.find((g) => g.id === groupId);
  if (!group) throw new Error("Group not found");

  const member = group.members.find((m) => m.id === memberId);
  if (!member) throw new Error("Member not found");

  const newRole = payload.role;

  const accessLevel =
    newRole === "Teacher"
      ? "organizer"
      : newRole === "Teacher assistant"
        ? "groupAdmin"
        : newRole === "Admin"
          ? "admin"
          : "user";

  member.role = newRole as Member["role"];
  member.accessLevel = accessLevel;
  group.updatedAt = new Date().toISOString();

  return {
    id: member.id,
    username: member.username,
    email: member.email,
    studentId: member.studentId,
    role: {
      id: `role-${member.id}`,
      role: member.role,
      accessLevel: member.accessLevel,
    },
  };
}
