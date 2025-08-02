import {
  canEditMembers,
  canArchiveGroup,
  isReadonlyMember,
} from "@/lib/permission";

import type { GroupRoleAccessLevel } from "@/types/group";
import { GlobalRole } from "@/lib/permission";
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
