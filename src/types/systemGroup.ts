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

// A gid a candidate's local group uses, and the compute nodes using it.
export type GidServers = {
  gidNumber: number;
  servers: string[];
};

// A different local group that already uses one of a candidate's gids on a
// compute node. Registering the candidate would grant that group there, so
// registration is refused while any conflict exists.
export type GidConflict = {
  server: string;
  name: string;
  gidNumber: number;
};

// A server-local group discovered on active compute nodes, offered for
// registration. Denylisted groups and groups with gid 0 or gid >= 1000 are
// never listed. GET /api/systemGroups/candidates
export type SystemGroupCandidate = {
  name: string;
  consistent: boolean; // true when every node that has the group uses the same gid
  gidNumber?: number; // present only when consistent is true
  gids: GidServers[];
  missingServers: string[]; // active nodes with discovery data that lack the group
  conflicts: GidConflict[]; // registration refused while non-empty
  registered: boolean; // already registered as a system group
};

// POST /api/systemGroups
export type RegisterSystemGroupRequest = {
  name: string; // name of a discovered local group; the backend resolves the gid
  description?: string;
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
