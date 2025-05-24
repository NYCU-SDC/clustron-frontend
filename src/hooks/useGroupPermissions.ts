import type { GroupRoleAccessLevel } from "@/types/group";
import {
  canEditMembers,
  canArchiveGroup,
  isReadonlyMember,
} from "@/lib/permission";

export function useGroupPermissions(
  accessLevel: GroupRoleAccessLevel | undefined,
) {
  return {
    canEditMembers: !!accessLevel && canEditMembers(accessLevel),
    canArchive: !!accessLevel && canArchiveGroup(accessLevel),
    isReadonly: !!accessLevel && isReadonlyMember(accessLevel),
  };
}
