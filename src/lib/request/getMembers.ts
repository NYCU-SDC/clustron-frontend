import type { GetGroupMembersResponse } from "@/types/group";

export async function getMembers(
  groupId: string,
  page = 1,
  pageSize = 100,
): Promise<GetGroupMembersResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: [
          {
            id: "1",
            username: "john_doe",
            email: "jone@gmail.com",
            studentId: "123456",
            role: {
              id: "1",
              role: "Group Owner",
              accessLevel: "GROUP_ADMIN",
            },
          },
          {
            id: "2",
            username: "john_doe222",
            email: "",
            studentId: "000111",
            role: {
              id: "2",
              role: "Student",
              accessLevel: "USER",
            },
          },
        ],
        totalPages: 1,
        totalItems: 0,
        currentPage: page,
        pageSize,
        hasNextPage: false,
      });
    }, 300);
  });
}
