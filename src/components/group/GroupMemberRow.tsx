// import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
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
import { Button } from "@/components/ui/button.tsx";

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
  const { t } = useTranslation();
  const assignableRoles = assignableRolesMap[accessLevel] ?? [];

  // for role i18n
  const getRoleLabel = (roleName: GroupMemberRoleName) => {
    return (
      t(`groupComponents.roles.${roleName}`) ||
      roleLabelMap[roleName] ||
      roleName
    );
  };

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
              <Button className="flex items-center gap-1 cursor-pointer font-medium text-sm">
                {getRoleLabel(role)}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {assignableRoles.map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => onUpdateRole?.(r)}
                  disabled={r === role}
                >
                  {getRoleLabel(r)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span>{getRoleLabel(role)}</span>
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
