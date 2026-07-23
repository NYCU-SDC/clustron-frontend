import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="member-detail-drawer">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DrawerTrigger>

        <DrawerContent side="bottom">
          <DrawerHeader>
            <DrawerTitle>{name}</DrawerTitle>
          </DrawerHeader>

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
            <DrawerFooter>
              <Button
                variant="ghost"
                className="w-full justify-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-600"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
                {t("groupComponents.memberDeleteButton.removeUser")}
              </Button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>

      <DeleteMemberConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </>
  );
}
