export type AccessLevel = "admin" | "organizer" | "groupAdmin" | "user";

export function canAddMember(level: AccessLevel): boolean {
  return ["admin", "organizer", "groupAdmin"].includes(level);
}

export function canRemoveMember(level: AccessLevel): boolean {
  return ["admin", "organizer", "groupAdmin"].includes(level);
}

export function canArchiveGroup(level: AccessLevel): boolean {
  return level === "admin" || level === "organizer";
}

export function canAssignAccessLevel(
  fromLevel: AccessLevel,
  toLevel: AccessLevel,
): boolean {
  const hierarchy: AccessLevel[] = ["user", "groupAdmin", "organizer", "admin"];
  const fromRank = hierarchy.indexOf(fromLevel);
  const toRank = hierarchy.indexOf(toLevel);

  return fromRank > toRank; // 只能給比自己低的
}

export function canShowRemoveButton(
  currentUserLevel: AccessLevel,
  targetLevel: AccessLevel,
): boolean {
  return (
    canRemoveMember(currentUserLevel) &&
    canAssignAccessLevel(currentUserLevel, targetLevel)
  );
}

export const roleAssignableMap: Record<string, string[]> = {
  Admin: ["Professor", "Teacher", "Teacher assistant", "Student", "Auditor"],
  Professor: ["Teacher assistant", "Student", "Auditor"],
  Teacher: ["Teacher assistant", "Student", "Auditor"],
  "Teacher assistant": ["Student", "Auditor"],
  Student: [],
  Auditor: [],
};
