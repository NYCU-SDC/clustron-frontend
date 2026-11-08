// A system group registered in Clustron: an LDAP posixGroup that mirrors a
// server-local group (e.g. docker, sudo) so its members receive the local
// group's gid on their next login.
export type SystemGroup = {
  id: string;
  name: string;
  gidNumber: number;
  description: string; // empty string when no description was given
  createdAt: string;
};

// A Clustron user that Clustron added to a system group.
export type SystemGroupMember = {
  userId: string;
  email: string;
  fullName: string;
  addedAt: string;
};

// POST /api/systemGroups/{id}/members
export type AddSystemGroupMemberRequest = {
  groupId: string;
  userId: string;
};

// DELETE /api/systemGroups/{id}/members/{userId}
export type RemoveSystemGroupMemberRequest = {
  groupId: string;
  userId: string;
};
