import type { TFunction } from "i18next";

import ResourceStatusBadge from "@/components/resource/ResourceStatusBadge";
import { createDataTableColumnHelper } from "@/components/ui/data-table";
import { RESOURCE_ROLE_LABEL_KEYS, type Server } from "@/types/resource";

const helper = createDataTableColumnHelper<Server>();

export function getResourceColumns(t: TFunction) {
  return helper.columns([
    helper.accessor("ansible_name", {
      header: t("resourceComponents.table.name"),
    }),
    helper.accessor((server) => server.ip_address || server.ssh_config_host, {
      id: "address",
      header: t("resourceComponents.table.address"),
    }),
    helper.accessor("ansible_role", {
      header: t("resourceComponents.table.role"),
      cell: ({ getValue }) => t(RESOURCE_ROLE_LABEL_KEYS[getValue()]),
    }),
    helper.accessor((server) => server.slurm_partition || "—", {
      id: "partition",
      header: t("resourceComponents.table.partition"),
    }),
    helper.display({
      id: "resources",
      header: t("resourceComponents.table.resources"),
      meta: { headClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row }) => {
        const { cpu_cores, memory_mb } = row.original;
        const memoryGb = memory_mb
          ? (memory_mb / 1024).toFixed(memory_mb % 1024 ? 1 : 0)
          : undefined;

        return (
          <div className="flex items-center justify-end gap-3 whitespace-nowrap">
            {cpu_cores != null && (
              <span className="flex items-baseline gap-1">
                <span className="text-base font-bold">{cpu_cores}</span>
                <span className="text-xs">CPU</span>
              </span>
            )}
            {memoryGb != null && (
              <span className="flex items-baseline gap-1">
                <span className="text-base font-bold">{memoryGb}GB</span>
                <span className="text-xs">Mem</span>
              </span>
            )}
          </div>
        );
      },
    }),
    helper.accessor("status", {
      header: t("resourceComponents.table.status"),
      cell: ({ getValue }) => <ResourceStatusBadge status={getValue()} />,
    }),
  ]);
}
