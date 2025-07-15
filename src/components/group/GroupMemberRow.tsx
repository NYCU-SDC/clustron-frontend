import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import MemberDeleteMenu from "./MemberDeleteMenu.tsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { assignableRolesMap, roleLabelMap } from "@/lib/permission";
import {
  AccessLevelOwner,
  AccessLevelUser,
  GlobalRole,
  type GroupMemberRoleName,
  type GroupRoleAccessLevel,
} from "@/types/group";
import { Button } from "@/components/ui/button.tsx";

type Props = {
  name: string;
  id: string;
  email: string;
  globalRole: GlobalRole;
  roleName: GroupMemberRoleName;
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
  globalRole,
  roleName,
  accessLevel = AccessLevelUser,
  onDelete,
  onUpdateRole,
  showActions = false,
  isArchived = false,
  isPending = false,
}: Props) {
  const { t } = useTranslation();
  const assignableRoles =
    assignableRolesMap[
      globalRole == "admin" ? AccessLevelOwner : accessLevel
    ] ?? [];
  const getRoleLabel = (roleName: GroupMemberRoleName) => {
    const translated = t?.(`groupComponents.roles.${roleName}`);
    if (translated && translated !== `groupComponents.roles.${roleName}`) {
      return translated;
    }

    return roleLabelMap[roleName] ?? roleName;
  };
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
        roleName !== "group_owner" ? (
          isPending ? (
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating...
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 font-medium text-sm px-2 py-1 hover:bg-muted"
                >
                  {getRoleLabel(roleName)}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {assignableRoles.map((r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => onUpdateRole?.(r)}
                    disabled={r === roleName}
                  >
                    {getRoleLabel(r)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        ) : (
          <span>{getRoleLabel(roleName)}</span>
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
