import type {
  AddLinuxGroupMembersResult,
  LinuxGroup,
  LinuxGroupMember,
} from "@/types/linuxGroup";

/**
 * In-memory stand-in for the Linux group API.
 *
 * The backend endpoints do not exist yet, so `lib/request/linuxGroups.ts`
 * reads and writes this store instead of calling `api()`. Mutations are kept
 * here (rather than in component state) so the UI exercises the same
 * request -> invalidate -> refetch flow it will use once the API lands.
 */

type MockGroup = {
  name: string;
  gid: number;
  members: LinuxGroupMember[];
};

const mockUsers = [
  {
    userIdentifier: "313551000",
    fullName: "Alice Chen",
    linuxUsername: "alice",
  },
  { userIdentifier: "313551001", fullName: "Bob Lin", linuxUsername: "bob" },
  { userIdentifier: "313551002", fullName: "Carol Wu", linuxUsername: "carol" },
  {
    userIdentifier: "313551003",
    fullName: "David Hsu",
    linuxUsername: "david",
  },
  {
    userIdentifier: "eve@nycu.edu.tw",
    fullName: "Eve Yang",
    linuxUsername: "eve",
  },
  {
    userIdentifier: "frank@nycu.edu.tw",
    fullName: "Frank Kuo",
    linuxUsername: "frank",
  },
];

function member(index: number, groupName: string): LinuxGroupMember {
  const user = mockUsers[index];
  return { id: `${groupName}-${user.linuxUsername}`, ...user };
}

const groups: MockGroup[] = [
  {
    name: "docker",
    gid: 985,
    members: [member(0, "docker"), member(1, "docker"), member(4, "docker")],
  },
  { name: "sudo", gid: 27, members: [member(0, "sudo")] },
  { name: "wheel", gid: 998, members: [] },
  { name: "video", gid: 44, members: [member(2, "video"), member(3, "video")] },
  { name: "render", gid: 989, members: [member(5, "render")] },
];

let nextGid = 1000;

function toLinuxGroup(group: MockGroup): LinuxGroup {
  return {
    name: group.name,
    gid: group.gid,
    memberCount: group.members.length,
  };
}

export function listMockGroups(search?: string): LinuxGroup[] {
  const keyword = search?.trim().toLowerCase();
  const matched = keyword
    ? groups.filter((g) => g.name.toLowerCase().includes(keyword))
    : groups;

  return matched.map(toLinuxGroup).sort((a, b) => a.name.localeCompare(b.name));
}

export function findMockGroup(name: string): MockGroup | undefined {
  return groups.find((g) => g.name === name.trim());
}

export function listMockGroupMembers(name: string): LinuxGroupMember[] {
  return findMockGroup(name)?.members ?? [];
}

/**
 * Builds a member entry for an identifier the seed data has never seen.
 *
 * The user field is backed by the real `/api/searchUser`, so an identifier
 * reaching this store is a real account the mock knows nothing about. Rejecting
 * it would mean the mock second-guessing the live user directory, so the
 * display fields are derived from the identifier instead.
 */
function syntheticMember(identifier: string, groupName: string) {
  const localPart = identifier.split("@")[0];

  return {
    id: `${groupName}-${localPart}`,
    userIdentifier: identifier,
    fullName: localPart,
    linuxUsername: localPart,
  };
}

/**
 * Adds identifiers to a group, creating the group when it does not exist yet.
 * Members already in the group are reported as per-member errors, mirroring
 * the partial-success shape the group member API already uses.
 */
export function addMockGroupMembers(
  name: string,
  members: string[],
): AddLinuxGroupMembersResult {
  const groupName = name.trim();
  let group = findMockGroup(groupName);

  if (!group) {
    group = { name: groupName, gid: nextGid++, members: [] };
    groups.push(group);
  }

  const errors: AddLinuxGroupMembersResult["errors"] = [];

  for (const raw of members) {
    const identifier = raw.trim();

    if (group.members.some((m) => m.userIdentifier === identifier)) {
      errors.push({ member: identifier, message: "Already in this group" });
      continue;
    }

    const seeded = mockUsers.find((u) => u.userIdentifier === identifier);

    group.members.push(
      seeded
        ? { id: `${groupName}-${seeded.linuxUsername}`, ...seeded }
        : syntheticMember(identifier, groupName),
    );
  }

  return {
    addedSuccessNumber: members.length - errors.length,
    addedFailureNumber: errors.length,
    errors,
  };
}

export function removeMockGroupMember(name: string, memberId: string): void {
  const group = findMockGroup(name);
  if (!group) return;

  group.members = group.members.filter((m) => m.id !== memberId);
}
