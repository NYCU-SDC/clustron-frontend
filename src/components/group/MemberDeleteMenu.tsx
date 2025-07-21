import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  onConfirm: () => Promise<void> | void;
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
      await onConfirm();
      setOpen(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isArchived}>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              {t("groupComponents.memberDeleteButton.deleteUserConfirm")}
            </DialogTitle>
            <DialogDescription>
              {t("groupComponents.memberDeleteButton.deleteConfirmation")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">
                {t("groupComponents.memberDeleteButton.cancel")}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
              >
                {t("groupComponents.memberDeleteButton.delete")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
