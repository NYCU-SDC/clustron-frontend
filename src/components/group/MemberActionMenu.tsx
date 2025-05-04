import { MoreHorizontal } from "lucide-react";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

export default function MemberActionMenu({
  onDelete,
}: {
  onDelete: () => void;
}) {
  return (
    <ConfirmDeleteDialog
      onConfirm={onDelete}
      trigger={
        <button className="p-2 rounded hover:bg-gray-200">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      }
    />
  );
}
