import { Badge } from "@/components/jobs/Badge";
import { createDataTableColumnHelper } from "@/components/ui/data-table";
import type { Job } from "@/types/jobs";

const helper = createDataTableColumnHelper<Job>();

function formatMem(mbOrGb: number) {
  return `${mbOrGb}GB`;
}

export const jobColumns = helper.columns([
  helper.accessor("id", {
    header: "#ID",
    meta: { headClassName: "w-[80px]", cellClassName: "font-medium" },
  }),
  helper.accessor("status", {
    header: "State",
    meta: { headClassName: "w-[140px]" },
    cell: ({ getValue }) => <Badge label={getValue()} variant="status" />,
  }),
  helper.accessor("user", { header: "User" }),
  helper.accessor("partition", { header: "Partition" }),
  helper.accessor("resources", {
    header: "Resources",
    cell: ({ getValue }) => {
      const resources = getValue();

      return (
        <div className="flex items-baseline gap-4">
          <span>
            <span className="font-semibold">{resources.cpu}</span>{" "}
            <span className="text-xs align-bottom">CPU</span>
          </span>
          <span>
            <span className="font-semibold">{resources.gpu}</span>{" "}
            <span className="text-xs align-bottom">GPU</span>
          </span>
          <span>
            <span className="font-semibold">{formatMem(resources.memory)}</span>{" "}
            <span className="text-xs align-bottom">Mem</span>
          </span>
        </div>
      );
    },
  }),
]);
