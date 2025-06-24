import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown, Loader2 } from "lucide-react";
import MemberDeleteMenu from "./MemberDeleteButton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { assignableRolesMap, roleLabelMap } from "@/lib/permission";
import {
  AccessLevelUser,
  type GroupMemberRoleName,
  type GroupRoleAccessLevel,
} from "@/types/group";

type Props = {
  name: string;
  id: string;
  email: string;
  role: GroupMemberRoleName;
  accessLevel?: GroupRoleAccessLevel;
  onDelete?: () => void;
  onUpdateRole?: (newRole: GroupMemberRoleName) => void;
  showActions?: boolean;
  isArchived?: boolean;
  isPending?: boolean;
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
  isPending = false,
}: Props) {
  const assignableRoles = assignableRolesMap[accessLevel] ?? [];

  return (
    <TableRow
      className={`hover:bg-muted transition-opacity ${
        isPending ? "opacity-50 cursor-wait" : ""
      }`}
    >
      <TableCell>{name}</TableCell>

      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{id}</span>
          <span className="text-muted-foreground text-xs">{email}</span>
        </div>
      </TableCell>

      <TableCell>
        {showActions &&
        assignableRoles.length > 0 &&
        !isArchived &&
        role !== "group_owner" ? (
          isPending ? (
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating...
            </div>
          ) : (
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
          )
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
