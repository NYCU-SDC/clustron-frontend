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

type Props = {
  onConfirm: () => void;
  isArchived?: boolean; // 改為更彈性的名稱
};

export default function MemberDeleteMenu({ onConfirm, isArchived }: Props) {
  const [open, setOpen] = useState(false);

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
              onClick={() => {
                setOpen(false); // 先關閉 Dialog
                onConfirm(); // 然後刪除
              }}
            >
              Remove User
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Delete User Confirm
            </DialogTitle>
            <DialogDescription>
              Are you sure to delete this user? This action is not recoverable.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  if (!isArchived) onConfirm();
                }}
              >
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
