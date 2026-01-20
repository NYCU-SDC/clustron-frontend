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
  isSelf?: boolean;
};

export default function UserConfigRow({
  name,
  id,
  email,
  currentRole,
  onUpdateRole,
  isPending = false,
  isSelf = false,
}: Props) {
  const roleLabel =
    GLOBAL_ROLE_OPTIONS.find((r) => r.id === currentRole)?.label || currentRole;

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="font-medium">
        {name}
        {isSelf && (
          <span className="text-[10px] ml-2 bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-bold">
            YOU
          </span>
        )}
      </TableCell>
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
            <DropdownMenuTrigger asChild disabled={isSelf}>
              <Button
                variant="ghost"
                className="flex items-center gap-1 font-medium text-sm px-2 py-1 h-8 hover:bg-muted"
              >
                {roleLabel}
                {!isSelf && <ChevronDown className="w-4 h-4 opacity-50" />}
              </Button>
            </DropdownMenuTrigger>
            {!isSelf && (
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
            )}
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
}
