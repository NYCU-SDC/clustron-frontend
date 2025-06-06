import {
  AccessLevelOwner,
  AccessLevelUser,
  type AddGroupMemberInput,
  type AddGroupMemberResponse,
} from "@/types/group";

export async function addMember(
  groupId: string,
  members: AddGroupMemberInput[],
): Promise<AddGroupMemberResponse[]> {
  return new Promise((resolve) => {
    // MOCK
    setTimeout(() => {
      const mockResponse: AddGroupMemberResponse[] = [
        {
          id: "001",
          username: "hoho",
          email: "hoho@example.com",
          studentId: "110700036",
          role: {
            id: "001",
            role: "Student",
            accessLevel: AccessLevelUser,
          },
        },
        {
          id: "002",
          username: "momo",
          email: "momo@example.com",
          studentId: "110700037",
          role: {
            id: "002",
            role: "Teacher assistant",
            accessLevel: AccessLevelOwner,
          },
        },
        {
          id: "003",
          username: "koko",
          email: "koko@example.com",
          studentId: "110700038",
          role: {
            id: "003",
            role: "Auditor",
            accessLevel: AccessLevelUser,
          },
        },
      ];

      resolve(mockResponse);
    }, 300);
  });
}

// export async function addMember(
//   groupId: string,
//   members: AddGroupMemberInput[],
// ): Promise<AddGroupMemberResponse[]> {
//   return api(`/api/groups/${groupId}/members`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(members),
//   });
// }
