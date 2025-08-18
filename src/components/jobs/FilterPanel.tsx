import { Dispatch, SetStateAction, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter as FilterIcon, ChevronDown, X } from "lucide-react";
import type { FilterOptions } from "@/types/type";
import {
  JOB_STATUS_COLORS,
  type JobState,
} from "@/components/jobs/StatusPill.tsx";

// Job status option
const ALL_STATUS: JobState[] = [
  "RUNNING",
  "PENDING",
  "FAILED",
  "COMPLETED",
  "TIMEOUT",
  "CANCELLED",
];

// Resource option
const ALL_RES: Array<"cpu" | "gpu"> = ["cpu", "gpu"];

// TODO: Replace with GET /api/jobs/partitions response
const ALL_PARTITIONS: string[] = ["default", "compute", "gpu"];

type Props = {
  filters: FilterOptions;
  setFilters: Dispatch<SetStateAction<FilterOptions>>;
};

export default function FilterPanel({ filters, setFilters }: Props) {
  const tags = useMemo(() => {
    const t: {
      key: string;
      label: string;
      className: string;
      onClear: () => void;
    }[] = [];

    if (filters.myJobs) {
      t.push({
        key: "myJobs",
        label: "MY JOBS",
        className: "bg-blue-100 text-blue-700",
        onClear: () => setFilters((f) => ({ ...f, myJobs: false })),
      });
    }

    filters.status.forEach((s) =>
      t.push({
        key: `st:${s}`,
        label: s,
        className: JOB_STATUS_COLORS[s],
        onClear: () =>
          setFilters((f) => ({
            ...f,
            status: f.status.filter((x) => x !== s),
          })),
      }),
    );

    filters.resource.forEach((r) =>
      t.push({
        key: `res:${r}`,
        label: r.toUpperCase(),
        className: "bg-neutral-800 text-white dark:bg-neutral-700",
        onClear: () =>
          setFilters((f) => ({
            ...f,
            resource: f.resource.filter((x) => x !== r),
          })),
      }),
    );

    filters.partition.forEach((p) =>
      t.push({
        key: `pt:${p}`,
        label: p.toUpperCase(),
        className: "bg-yellow-200 text-yellow-900",
        onClear: () =>
          setFilters((f) => ({
            ...f,
            partition: f.partition.filter((x) => x !== p),
          })),
      }),
    );

    return t;
  }, [filters, setFilters]);

  const toggleStatus = (s: JobState) =>
    setFilters((f) => ({
      ...f,
      status: f.status.includes(s)
        ? f.status.filter((x) => x !== s)
        : [...f.status, s],
    }));

  const toggleRes = (r: "cpu" | "gpu") =>
    setFilters((f) => ({
      ...f,
      resource: f.resource.includes(r)
        ? f.resource.filter((x) => x !== r)
        : [...f.resource, r],
    }));

  const togglePartition = (p: string) =>
    setFilters((f) => ({
      ...f,
      partition: f.partition.includes(p)
        ? f.partition.filter((x) => x !== p)
        : [...f.partition, p],
    }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between rounded-xl border-muted-foreground/20 bg-muted/30"
        >
          <div className="flex min-w-0 items-center gap-2">
            <FilterIcon className="h-4 w-4 opacity-80" />
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto no-scrollbar">
              {tags.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  Job Filter
                </span>
              ) : (
                tags.map((t) => (
                  <TagPill
                    key={t.key}
                    label={t.label}
                    className={t.className}
                    onClear={t.onClear}
                  />
                ))
              )}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuCheckboxItem
          checked={filters.myJobs}
          onCheckedChange={(v) => setFilters((f) => ({ ...f, myJobs: !!v }))}
          onSelect={(e) => e.preventDefault()}
        >
          My Jobs
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Job Status</DropdownMenuLabel>
        {ALL_STATUS.map((s) => (
          <DropdownMenuCheckboxItem
            key={s}
            checked={filters.status.includes(s)}
            onCheckedChange={() => toggleStatus(s)}
            onSelect={(e) => e.preventDefault()}
          >
            {s}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Resources</DropdownMenuLabel>
        {ALL_RES.map((r) => (
          <DropdownMenuCheckboxItem
            key={r}
            checked={filters.resource.includes(r)}
            onCheckedChange={() => toggleRes(r)}
            onSelect={(e) => e.preventDefault()}
          >
            {r.toUpperCase()}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Partition</DropdownMenuLabel>
        {ALL_PARTITIONS.map((p) => (
          <DropdownMenuCheckboxItem
            key={p}
            checked={filters.partition.includes(p)}
            onCheckedChange={() => togglePartition(p)}
            onSelect={(e) => e.preventDefault()}
          >
            {p}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TagPill({
  label,
  className,
  onClear,
}: {
  label: string;
  className: string;
  onClear: () => void;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        className,
      ].join(" ")}
    >
      {label}
      <span
        role="button"
        tabIndex={0}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClear();
        }}
        className="cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </span>
    </span>
  );
}
