// src/api/login.ts
import { mockUsers } from "../lib/userMock";
import { signToken } from "../lib/auth";

export async function loginByStudentId(studentId: string): Promise<string> {
  const user = mockUsers.find((u) => u.studentId === studentId);
  if (!user) {
    throw new Error("無此學號");
  }

  const token = signToken({
    id: user.id,
    studentId: user.studentId,
    username: user.username,
    accessLevel: user.accessLevel,
    role: user.role,
    dept: user.dept,
  });

  return token;
}
