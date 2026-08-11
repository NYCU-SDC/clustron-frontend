import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Server } from "@/types/resource";
import ResourceRow from "@/components/resource/ResourceRow";

type Props = {
  servers: Server[];
  isLoading: boolean;
  isError: boolean;
};

export default function ResourceTable({ servers, isLoading, isError }: Props) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("resourceComponents.table.loading")}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">
        {t("resourceComponents.table.loadingFailed")}
      </p>
    );
  }

  if (servers.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        {t("resourceComponents.table.noResources")}
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("resourceComponents.table.name")}</TableHead>
            <TableHead>{t("resourceComponents.table.address")}</TableHead>
            <TableHead>{t("resourceComponents.table.role")}</TableHead>
            <TableHead>{t("resourceComponents.table.partition")}</TableHead>
            <TableHead className="text-right">
              {t("resourceComponents.table.resources")}
            </TableHead>
            <TableHead>{t("resourceComponents.table.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servers.map((server) => (
            <ResourceRow key={server.id} server={server} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
