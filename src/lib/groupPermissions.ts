import {
  canEditMembers,
  canArchiveGroup,
  isReadonlyMember,
} from "@/lib/permission";

import type { GroupRoleAccessLevel, GlobalRole } from "@/types/group";

export function getGroupPermissions(
  accessLevel: GroupRoleAccessLevel | undefined,
  globalRole: GlobalRole | undefined,
) {
  return {
    canEditMembers: canEditMembers(accessLevel, globalRole),
    canArchive: canArchiveGroup(accessLevel, globalRole),
    isReadonly: isReadonlyMember(accessLevel),
  };
}
