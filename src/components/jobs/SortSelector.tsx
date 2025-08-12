import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  ChevronDown,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
} from "lucide-react";
import type { SortBy } from "@/types/type";

const sortOptions: { key: SortBy; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "user", label: "User" },
  { key: "state", label: "Status" },
  { key: "cpu", label: "CPU" },
  { key: "gpu", label: "GPU" },
  { key: "mem", label: "Mem" },
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
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <ArrowUpNarrowWide className="h-4 w-4" />
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
              className="justify-between"
            >
              {opt.label}
              {sortBy === opt.key && <Check className="h-4 w-4" />}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
            className="justify-between"
          >
            {sortOrder === "asc" ? "Ascending" : "Descending"}
            {sortOrder === "asc" ? (
              <ArrowUpNarrowWide className="h-4 w-4" />
            ) : (
              <ArrowDownWideNarrow className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
