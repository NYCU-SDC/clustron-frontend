import { mockGroups, Member } from "@/lib/mockGroups";
import type { CreateGroupInput, MemberInput } from "@/types/group";
import { mockUsers } from "@/lib/userMock";
import { AccessLevel } from "@/lib/permission";

export async function createGroup(payload: CreateGroupInput) {
  await new Promise((r) => setTimeout(r, 1000));

  const id = `mock-${Date.now()}`;
  const createdAt = new Date().toISOString();

  const newGroup = {
    id,
    title: payload.title,
    description: payload.description,
    isArchived: false,
    createdAt,
    updatedAt: createdAt,
    members: payload.members.map((memberInput: MemberInput) => {
      // 根據 studentId 或 email 查找對應的完整使用者資料
      const user = mockUsers.find(
        (user) =>
          user.studentId === memberInput.member ||
          user.email === memberInput.member,
      );

      if (!user) {
        throw new Error(`User with ${memberInput.member} not found`);
      }

      // 待改
      const accessLevel: AccessLevel =
        memberInput.role === "Admin"
          ? "admin"
          : memberInput.role === "Professor" || memberInput.role === "Teacher"
            ? "organizer"
            : memberInput.role === "Teacher assistant"
              ? "groupAdmin"
              : "user";

      // 構建並返回完整的成員資料
      const member: Member = {
        id: user.id,
        username: user.username,
        email: user.email,
        studentId: user.studentId,
        role: memberInput.role as
          | "Admin"
          | "Professor"
          | "Teacher"
          | "Teacher assistant"
          | "Student"
          | "Auditor", // 根據使用者輸入的 role
        accessLevel, // 設定 accessLevel
        dept: user.dept,
      };

      return member;
    }),
  };

  mockGroups.unshift(newGroup); // 將新群組加入 mockGroups

  return {
    id,
    title: newGroup.title,
    description: newGroup.description,
    isArchived: newGroup.isArchived,
    createdAt: newGroup.createdAt,
    updatedAt: newGroup.updatedAt,
    me: {
      role: {
        id: "mock-role-" + id,
        role: "Professor",
        accessLevel: "admin" as AccessLevel, // 管理員
      },
    },
  };
}
