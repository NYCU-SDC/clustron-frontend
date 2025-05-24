import type { GroupRoleAccessLevel } from "@/types/group";
import {
  canEditMembers,
  canViewMembers,
  canArchiveGroup,
  isReadonlyMember,
} from "@/lib/permission";

export function useGroupPermissions(
  accessLevel: GroupRoleAccessLevel | undefined,
) {
  return {
    canEditMembers: !!accessLevel && canEditMembers(accessLevel),
    canViewMembers: !!accessLevel && canViewMembers(accessLevel),
    canArchive: !!accessLevel && canArchiveGroup(accessLevel),
    isReadonly: !!accessLevel && isReadonlyMember(accessLevel),
  };
}
