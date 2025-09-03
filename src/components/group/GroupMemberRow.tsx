import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown, Loader2 } from "lucide-react";
import MemberDeleteMenu from "./MemberDeleteMenu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AccessLevelUser,
  AccessLevelOwner,
  type GroupRoleAccessLevel,
} from "@/types/group";
import { useRoleMapper } from "@/hooks/useRoleMapper"; //
import { Button } from "@/components/ui/button";
import { GlobalRole } from "@/lib/permission";
type Props = {
  name: string;
  id: string;
  email: string;
  globalRole: GlobalRole;
  role: string;
  accessLevel?: GroupRoleAccessLevel;
  onDelete?: () => void;
  onUpdateRole?: (newRoleId: string) => void;
  showActions?: boolean;
  isArchived?: boolean;
  isPending?: boolean;
};

export default function GroupMemberRow({
  name,
  id,
  email,
  globalRole,
  role,
  accessLevel = AccessLevelUser,
  onDelete,
  onUpdateRole,
  showActions = false,
  isArchived = false,
  isPending = false,
}: Props) {
  // const { t } = useTranslation();
  const { getRolesByAccessLevel, roles } = useRoleMapper();

  const effectiveAccessLevel =
    globalRole === "admin" ? AccessLevelOwner : accessLevel;

  const assignableRoles = getRolesByAccessLevel(effectiveAccessLevel);
  const currentRole = roles.find((r) => r.roleName === role);
  const currentRoleLabel = currentRole?.roleName || role;

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
        {showActions && !isArchived && role !== "group_owner" ? (
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
          )
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
