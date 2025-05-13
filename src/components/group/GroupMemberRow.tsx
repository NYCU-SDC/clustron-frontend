import MemberDeleteMenu from "./MemberActionMenu";
import { TableRow, TableCell } from "@/components/ui/table";

type Props = {
  name: string;
  id: string;
  email: string;
  dept: string;
  role: string;
  onDelete?: () => void;
  showActions?: boolean;
  isArchived?: boolean;
};

export default function GroupMemberRow({
  name,
  id,
  email,
  dept,
  role,
  onDelete,
  showActions = false,
  isArchived = false,
}: Props) {
  return (
    <TableRow className="hover:bg-muted">
      <TableCell>{name}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{id}</span>
          <span className="text-muted-foreground text-xs">{email}</span>
        </div>
      </TableCell>
      <TableCell>{dept}</TableCell>
      <TableCell>{role}</TableCell>

      {showActions && (
        <TableCell className="text-right pr-4">
          <MemberDeleteMenu onConfirm={onDelete!} isArchived={isArchived} />
        </TableCell>
      )}
    </TableRow>
  );
}
