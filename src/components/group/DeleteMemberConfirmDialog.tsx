import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
};

export default function DeleteMemberConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: Props) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {t("groupComponents.memberDeleteButton.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
