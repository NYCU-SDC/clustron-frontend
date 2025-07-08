import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import MemberDeleteMenu from "./MemberDeleteButton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AccessLevelUser,
  type GroupMemberRoleName,
  type GroupRoleAccessLevel,
} from "@/types/group";
import { useRoleMapper } from "@/hooks/useRoleMapper"; //
type Props = {
  name: string;
  id: string;
  email: string;
  role: string;
  accessLevel?: GroupRoleAccessLevel;
  onDelete?: () => void;
  onUpdateRole?: (newRole: GroupMemberRoleName) => void;
  showActions?: boolean;
  isArchived?: boolean;
};

export default function GroupMemberRow({
  name,
  id,
  email,
  role,
  accessLevel = AccessLevelUser,
  onDelete,
  onUpdateRole,
  showActions = false,
  isArchived = false,
}: Props) {
  const { getRolesByAccessLevel, roles, isLoading } = useRoleMapper();

  const assignableRoles = getRolesByAccessLevel(accessLevel);

  // ✅ 查找當前 role 的 label
  const currentRole = roles.find((r) => r.roleName === role);
  const currentRoleLabel = currentRole?.roleName || role;

  return (
    <TableRow className="hover:bg-muted">
      <TableCell>{name}</TableCell>

      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{id}</span>
          <span className="text-muted-foreground text-xs">{email}</span>
        </div>
      </TableCell>

      <TableCell>
        {isLoading ? (
          <span className="text-xs text-muted-foreground">Loading...</span>
        ) : showActions &&
          assignableRoles.length > 0 &&
          !isArchived &&
          role !== "group_owner" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 cursor-pointer font-medium text-sm">
                {currentRoleLabel}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {assignableRoles.map((r) => (
                <DropdownMenuItem
                  key={r.id}
                  onClick={() => onUpdateRole?.(r.roleName)}
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
