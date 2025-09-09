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
import { Filter as FilterIcon, ChevronDown } from "lucide-react";
import type { FilterOptions } from "@/types/jobs";
import type { JobState } from "@/types/jobs";
import { Badge } from "@/components/jobs/Badge.tsx";

// Job status options
const ALL_STATUS: JobState[] = [
  "RUNNING",
  "PENDING",
  "FAILED",
  "COMPLETED",
  "TIMEOUT",
  "CANCELLED",
];

// Resource options
const ALL_RES: Array<"cpu" | "gpu"> = ["cpu", "gpu"];

// Partition options (mock)
const ALL_PARTITIONS: string[] = ["default", "compute"];

type Props = {
  filters: FilterOptions;
  setFilters: Dispatch<SetStateAction<FilterOptions>>;
};

export default function FilterPanel({ filters, setFilters }: Props) {
  const tags = useMemo(() => {
    const t: {
      key: string;
      label: string;
      variant: "status" | "resource" | "partition";
      onClear: () => void;
    }[] = [];

    filters.status.forEach((s) =>
      t.push({
        key: `st:${s}`,
        label: s,
        variant: "status",
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
        variant: "resource",
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
        variant: "partition",
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
                  <Badge
                    label={t.label}
                    variant={t.variant}
                    mode="interactive"
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
