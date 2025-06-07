import { useGlobalRole } from "@/hooks/useGlobalRole";
import { canCreateGroup, GlobalRole, isGlobalAdmin } from "@/lib/permission";

export function useGlobalPermissions() {
  const role = useGlobalRole();
  return {
    role,
    canCreateGroup: !!role && canCreateGroup(role as GlobalRole),
    isGlobalAdmin: !!role && isGlobalAdmin(role as GlobalRole),
  };
}
