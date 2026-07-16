import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteMemberConfirmDialog from "./DeleteMemberConfirmDialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  onConfirm: () => void;
  isArchived?: boolean;
};

export default function MemberDeleteMenu({ onConfirm, isArchived }: Props) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (isArchived) return;
    setIsPending(true);
    try {
      onConfirm();
      setOpen(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isArchived}
            aria-label="user-actions-menu"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        {!isArchived && (
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setOpen(true)}
            >
              {t("groupComponents.memberDeleteButton.removeUser")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      <DeleteMemberConfirmDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </>
  );
}
