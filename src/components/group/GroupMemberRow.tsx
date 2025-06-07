// import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
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
};

export default function GroupMemberRow({
  name,
  id,
  email,
  role,
  accessLevel = AccessLevelUser, //TODO
  onDelete,
  onUpdateRole,
  showActions = false,
  isArchived = false,
}: Props) {
  const assignableRoles = assignableRolesMap[accessLevel] ?? [];
  // console.log("👀 member role:", role);
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
        {showActions &&
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
