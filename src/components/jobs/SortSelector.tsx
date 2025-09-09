import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
} from "lucide-react";
import type { SortBy } from "@/types/jobs";

const sortOptions: { key: SortBy; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "user", label: "User" },
  { key: "state", label: "Status" },
  { key: "cpu", label: "CPU" },
  { key: "gpu", label: "GPU" },
  { key: "memory", label: "Mem" },
  { key: "partition", label: "Partition" },
];

type Props = {
  sortBy: SortBy;
  setSortBy: Dispatch<SetStateAction<SortBy>>;
  sortOrder: "asc" | "desc";
  setSortOrder: Dispatch<SetStateAction<"asc" | "desc">>;
};

export default function SortSelector({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: Props) {
  const toggleOrder = () => setSortOrder((p) => (p === "asc" ? "desc" : "asc"));

  return (
    <div className="w-[96px] inline-flex  rounded-lg border bg-background">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleOrder}
        title={sortOrder === "asc" ? "Descending" : "Ascending"}
        aria-label={sortOrder === "asc" ? "Set descending" : "Set ascending"}
        className="rounded-none rounded-l-lg"
      >
        {sortOrder === "asc" ? (
          <ArrowUpNarrowWide className="h-4 w-4" />
        ) : (
          <ArrowDownWideNarrow className="h-4 w-4" />
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex-1 gap-2 rounded-none rounded-r-lg  w-1/6"
          >
            Sort
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sortOptions.map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt.key}
              checked={sortBy === opt.key}
              onCheckedChange={() => setSortBy(opt.key)}
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
