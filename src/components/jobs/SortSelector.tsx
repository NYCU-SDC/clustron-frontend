import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandList, CommandItem } from "@/components/ui/command";
import { SortBy } from "@/types/type";

export interface SortSelectorProps {
  sortBy: SortBy;
  setSortBy: (field: SortBy) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}

const options: SortBy[] = [
  "id",
  "user",
  "state",
  "partition",
  "cpu",
  "gpu",
  "mem",
];

const SortSelector: React.FC<SortSelectorProps> = ({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className="transform rotate-90">⇅</span>
          Sort
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0">
        <Command>
          <CommandList>
            {options.map((opt) => (
              <CommandItem
                key={opt}
                onSelect={() => setSortBy(opt)}
                className={`flex justify-between ${sortBy === opt ? "bg-accent" : ""}`}
              >
                {opt.toUpperCase()}
              </CommandItem>
            ))}
            <CommandItem
              onSelect={() =>
                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              }
              className="mt-1"
            >
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SortSelector;
