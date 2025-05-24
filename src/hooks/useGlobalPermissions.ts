import { useGlobalRole } from "@/hooks/useGlobalRole";
import { canCreateGroup, isGlobalAdmin } from "@/lib/permission";

export function useGlobalPermissions() {
  const role = useGlobalRole();

  return {
    role,
    canCreateGroup: !!role && canCreateGroup(role),
    isGlobalAdmin: !!role && isGlobalAdmin(role),
  };
}
