export type AccessLevel = "admin" | "organizer" | "groupAdmin" | "user";

// 可以新增成員
export function canAddMember(level: AccessLevel): boolean {
  return ["admin", "organizer", "groupAdmin"].includes(level);
}

// 可以移除成員
export function canRemoveMember(level: AccessLevel): boolean {
  return ["admin", "organizer", "groupAdmin"].includes(level);
}

// 可以封存／取消封存群組
export function canArchiveGroup(level: AccessLevel): boolean {
  return level === "admin" || level === "organizer";
}

// 可以指派目標使用者為指定 accessLevel（避免組長賦予超權限）
export function canAssignAccessLevel(
  fromLevel: AccessLevel,
  toLevel: AccessLevel,
): boolean {
  const hierarchy: AccessLevel[] = ["user", "groupAdmin", "organizer", "admin"];
  const fromRank = hierarchy.indexOf(fromLevel);
  const toRank = hierarchy.indexOf(toLevel);

  return fromRank > toRank; // 只能給比自己低的
}

// 顯示刪除按鈕的判斷（含 disabled 狀態用）
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
  admin: ["Professor", "Teacher", "Teacher assistant", "Student", "Auditor"],
  professor: ["Teacher assistant", "Student", "Auditor"],
  teacher: ["Teacher assistant", "Student", "Auditor"],
  "teacher assistant": ["Student", "Auditor"],
  student: [],
  auditor: [],
};
