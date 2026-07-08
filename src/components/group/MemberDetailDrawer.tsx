import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import DeleteMemberConfirmDialog from "./DeleteMemberConfirmDialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  name: string;
  email: string;
  studentId: string;
  role: string;
  onDelete?: () => void;
  isArchived?: boolean;
};

export default function MemberDetailDrawer({
  name,
  email,
  studentId,
  role,
  onDelete,
  isArchived = false,
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (isArchived || !onDelete) return;
    setIsPending(true);
    try {
      onDelete();
      setConfirmOpen(false);
      setOpen(false);
    } finally {
      setIsPending(false);
    }
  };

  const detailRows = [
    { label: t("groupComponents.memberDetailDrawer.email"), value: email },
    {
      label: t("groupComponents.memberDetailDrawer.studentId"),
      value: studentId,
    },
    { label: t("groupComponents.memberDetailDrawer.role"), value: role },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="user-actions-menu">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="fixed inset-x-0 bottom-0 top-auto w-full max-w-full translate-x-0 translate-y-0 gap-4 rounded-b-none rounded-t-2xl sm:top-[50%] sm:left-[50%] sm:right-auto sm:bottom-auto sm:max-w-md sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
          </DialogHeader>

          <div className="rounded-lg border">
            {detailRows.map((row, index) => (
              <div
                key={row.label}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${
                  index !== detailRows.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="text-muted-foreground text-sm">
                  {row.label}
                </span>
                <span className="text-right font-medium break-all">
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {onDelete && !isArchived && (
            <DialogFooter>
              <Button
                variant="ghost"
                className="w-full justify-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-600"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
                {t("groupComponents.memberDeleteButton.removeUser")}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <DeleteMemberConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </>
  );
}
