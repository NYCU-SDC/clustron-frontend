import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ServerStatus } from "@/types/resource";
import { useTranslation } from "react-i18next";

const STATUS_COLORS: Record<ServerStatus, string> = {
  active: "bg-green-200 text-green-600",
  provisioning: "bg-yellow-100 text-yellow-700",
  failed: "bg-rose-100 text-rose-600",
  unset: "bg-gray-100 text-gray-700",
};

export default function ResourceStatusBadge({
  status,
}: {
  status: ServerStatus;
}) {
  const { t } = useTranslation();

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border-transparent px-2.5 py-0.5 text-xs font-semibold uppercase",
        STATUS_COLORS[status],
      )}
    >
      {t(`resourceComponents.status.${status}`)}
    </Badge>
  );
}
