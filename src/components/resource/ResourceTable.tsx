import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { DataTable } from "@/components/ui/data-table";
import ResourceDetailSheet from "@/components/resource/ResourceDetailSheet";
import { getResourceColumns } from "@/components/resource/resourceColumns";
import type { Server } from "@/types/resource";

type Props = {
  servers: Server[];
  isLoading: boolean;
  isError: boolean;
};

export default function ResourceTable({ servers, isLoading, isError }: Props) {
  const { t } = useTranslation();
  const columns = useMemo(() => getResourceColumns(t), [t]);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openDetail = (server: Server) => {
    setSelectedServer(server);
    setDetailOpen(true);
  };

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg border shadow-sm">
        <DataTable
          columns={columns}
          data={servers}
          isLoading={isLoading}
          isError={isError}
          loadingMessage={t("resourceComponents.table.loading")}
          errorMessage={t("resourceComponents.table.loadingFailed")}
          emptyMessage={t("resourceComponents.table.noResources")}
          getRowId={(server) => server.id}
          onRowClick={openDetail}
        />
      </div>

      {selectedServer && (
        <ResourceDetailSheet
          key={selectedServer.id}
          server={selectedServer}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      )}
    </>
  );
}
