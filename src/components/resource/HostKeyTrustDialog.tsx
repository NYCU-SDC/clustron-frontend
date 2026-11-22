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
import type { HostKeyStatus } from "@/types/resource";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
  status: HostKeyStatus;
  fingerprint?: string;
};

// HostKeyTrustDialog asks the user to confirm an SSH host key's fingerprint before it is pinned,
// trust-on-first-use style. A "changed" key is treated as destructive (it may indicate a MITM).
export default function HostKeyTrustDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  status,
  fingerprint,
}: Props) {
  const { t } = useTranslation();
  const changed = status === "changed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={changed ? "text-red-600" : ""}>
            {changed
              ? t("resourceComponents.healthCheck.trustTitleChanged")
              : t("resourceComponents.healthCheck.trustTitleNew")}
          </DialogTitle>
          <DialogDescription>
            {changed
              ? t("resourceComponents.healthCheck.trustDescriptionChanged")
              : t("resourceComponents.healthCheck.trustDescriptionNew")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-1">
          <p className="text-sm font-medium">
            {t("resourceComponents.healthCheck.fingerprintLabel")}
          </p>
          <pre className="overflow-x-auto rounded bg-muted px-2 py-1 text-xs">
            {fingerprint ?? "-"}
          </pre>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">{t("common.cancel")}</Button>
          </DialogClose>
          <Button
            variant={changed ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isPending}
          >
            {t("resourceComponents.healthCheck.trustConfirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
