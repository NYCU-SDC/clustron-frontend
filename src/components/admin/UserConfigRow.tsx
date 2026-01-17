import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { GLOBAL_ROLE_OPTIONS, type GlobalRole } from "@/types/admin";

type Props = {
  name: string;
  id: string;
  email: string;
  currentRole: GlobalRole;
  onUpdateRole: (newRole: GlobalRole) => void;
  isPending?: boolean;
};

export default function UserConfigRow({
  name,
  id,
  email,
  currentRole,
  onUpdateRole,
  isPending = false,
}: Props) {
  const roleLabel =
    GLOBAL_ROLE_OPTIONS.find((r) => r.id === currentRole)?.label || currentRole;

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{id}</span>
          <span className="text-muted-foreground text-xs">{email}</span>
        </div>
      </TableCell>
      <TableCell>
        {isPending ? (
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating...
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1 font-medium text-sm px-2 py-1 h-8 hover:bg-muted"
              >
                {roleLabel}
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {GLOBAL_ROLE_OPTIONS.map((role) => (
                <DropdownMenuCheckboxItem
                  key={role.id}
                  checked={role.id === currentRole}
                  onCheckedChange={() => onUpdateRole(role.id)}
                >
                  {role.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
}
