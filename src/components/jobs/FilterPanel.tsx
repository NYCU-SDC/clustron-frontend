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
import type { FilterOptions, JobState } from "@/types/type";

const ALL_STATUS: JobState[] = [
  "RUNNING",
  "PENDING",
  "FAILED",
  "COMPLETED",
  "TIMEOUT",
  "CANCELLED",
];
const ALL_RES: Array<"cpu" | "gpu"> = ["cpu", "gpu"];

type Props = {
  filters: FilterOptions;
  setFilters: Dispatch<SetStateAction<FilterOptions>>;
};

export default function FilterPanel({ filters, setFilters }: Props) {
  const tags = useMemo(() => {
    const t: {
      key: string;
      label: string;
      onClear: () => void;
      tone?: "dark" | "blue";
    }[] = [];
    if (filters.myJobs) {
      t.push({
        key: "myJobs",
        label: "MY JOBS",
        tone: "blue",
        onClear: () => setFilters((f) => ({ ...f, myJobs: false })),
      });
    }
    filters.status.forEach((s) =>
      t.push({
        key: `st:${s}`,
        label: s,
        tone: "blue",
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
        tone: "dark",
        onClear: () =>
          setFilters((f) => ({
            ...f,
            resource: f.resource.filter((x) => x !== r),
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
                    tone={t.tone}
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
            onSelect={(e) => e.preventDefault()} // 防止關閉
          >
            {r.toUpperCase()}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TagPill({
  label,
  onClear,
  tone = "blue",
}: {
  label: string;
  onClear: () => void;
  tone?: "blue" | "dark";
}) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold";
  const style =
    tone === "dark"
      ? "bg-neutral-800 text-white dark:bg-neutral-700"
      : "bg-blue-100 text-blue-700";

  return (
    <span className={`${base} ${style}`}>
      {label}
      <button
        type="button"
        aria-label={`remove ${label}`}
        className="ml-0.5 opacity-80 hover:opacity-100"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClear();
        }}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}
