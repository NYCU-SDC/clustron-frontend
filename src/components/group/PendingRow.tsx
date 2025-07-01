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
import { useRoleMapper } from "@/hooks/useRoleMapper"; // ✅ 改為動態 hook

type Props = {
  id: string;
  email: string;
  role: GroupMemberRoleName;
  accessLevel?: GroupRoleAccessLevel;
  onDelete?: () => void;
  onUpdateRole?: (newRole: GroupMemberRoleName) => void;
  showActions?: boolean;
  isArchived?: boolean;
};

export default function GroupMemberRow({
  id,
  email,
  role,
  accessLevel = AccessLevelUser,
  onDelete,
  onUpdateRole,
  showActions = false,
  isArchived = false,
}: Props) {
  const { assignableRolesMap, roleLabelMap, isLoading } = useRoleMapper();
  const assignableRoles = assignableRolesMap[accessLevel] ?? [];

  return (
    <TableRow className="hover:bg-muted">
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
                {roleLabelMap[role] ?? role}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {assignableRoles.map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => onUpdateRole?.(r)}
                  disabled={r === role}
                >
                  {roleLabelMap[r] ?? r}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span>{roleLabelMap[role] ?? role}</span>
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
