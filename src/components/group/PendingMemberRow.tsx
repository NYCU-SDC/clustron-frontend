import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import MemberDeleteMenu from "./MemberDeleteMenu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRoleMapper } from "@/hooks/useRoleMapper";

import {
  AccessLevelUser,
  AccessLevelOwner,
  type GroupRoleAccessLevel,
} from "@/types/group";
import { Button } from "@/components/ui/button";
import { GlobalRole } from "@/lib/permission";
type Props = {
  id: string;
  email: string;
  role: string;
  accessLevel?: GroupRoleAccessLevel;
  globalRole: GlobalRole;
  onDelete?: () => void;
  onUpdateRole?: (roleId: string) => void;
  showActions?: boolean;
  isArchived?: boolean;
};

export default function PendingMemberRow({
  id,
  email,
  role,
  accessLevel = AccessLevelUser, //default to user access level
  globalRole,
  onDelete,
  onUpdateRole,
  showActions = false,
  isArchived = false,
}: Props) {
  const { getRolesByAccessLevel, roles } = useRoleMapper();
  const effectiveAccessLevel =
    globalRole === "admin" ? AccessLevelOwner : accessLevel;

  const assignableRoles = getRolesByAccessLevel(effectiveAccessLevel);

  const currentRole = roles.find((r) => r.roleName === role);
  const currentRoleLabel = currentRole?.roleName || role;

  return (
    <TableRow className="hover:bg-muted">
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{id}</span>
          <span className="text-muted-foreground text-xs">{email}</span>
        </div>
      </TableCell>

      <TableCell>
        {showActions && !isArchived && role !== "group_owner" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1 cursor-pointer font-medium text-sm"
              >
                {currentRoleLabel}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {assignableRoles.map((r) => (
                <DropdownMenuItem
                  key={r.id}
                  onClick={() => onUpdateRole?.(r.id)}
                  disabled={r.roleName === role}
                >
                  {r.roleName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span>{currentRoleLabel}</span>
        )}
      </TableCell>

      {showActions && (
        <TableCell className="text-right pr-4">
          <MemberDeleteMenu onConfirm={onDelete!} isArchived={isArchived} />
        </TableCell>
      )}
    </TableRow>
  );
}
