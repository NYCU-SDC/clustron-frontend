import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { RESOURCE_ROLE_LABEL_KEYS, type Server } from "@/types/resource";
import ResourceStatusBadge from "@/components/resource/ResourceStatusBadge";
import ResourceDetailSheet from "@/components/resource/ResourceDetailSheet";

export default function ResourceRow({ server }: { server: Server }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const memoryGb = server.memory_mb
    ? (server.memory_mb / 1024).toFixed(server.memory_mb % 1024 ? 1 : 0)
    : undefined;

  return (
    <>
      <TableRow
        className="cursor-pointer"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
      >
        <TableCell>{server.ansible_name}</TableCell>
        <TableCell>{server.ip_address || server.ssh_config_host}</TableCell>
        <TableCell>
          {t(RESOURCE_ROLE_LABEL_KEYS[server.ansible_role])}
        </TableCell>
        <TableCell>{server.slurm_partition || "—"}</TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-3 whitespace-nowrap">
            {server.cpu_cores != null && (
              <span className="flex items-baseline gap-1">
                <span className="text-base font-bold">{server.cpu_cores}</span>
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
        </TableCell>
        <TableCell>
          <ResourceStatusBadge status={server.status} />
        </TableCell>
      </TableRow>

      <ResourceDetailSheet server={server} open={open} onOpenChange={setOpen} />
    </>
  );
}
