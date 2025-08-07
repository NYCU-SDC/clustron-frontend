import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { FilterOptions, JobState, Resources } from "@/types/type";

export interface FilterPanelProps {
  filters: FilterOptions;
  setFilters: (opts: FilterOptions) => void;
}

const statusOptions: JobState[] = ["RUNNING", "PENDING", "FAILED"];
const resourceOptions: (keyof Resources)[] = ["cpu", "gpu"];

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters }) => {
  const toggle = (
    key: "status" | "resource",
    value: JobState | keyof Resources,
  ) => {
    const list = filters[key];
    const updated = list.includes(value as any)
      ? list.filter((v) => v !== value)
      : [...list, value as any];
    setFilters({ ...filters, [key]: updated });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <span className="mr-2">🔍</span> Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        {/*<div className="flex justify-end p-2">*/}
        {/*  <PopoverClose asChild>*/}
        {/*    <Button variant="ghost" size="icon" aria-label="Close">*/}
        {/*      ✕*/}
        {/*    </Button>*/}
        {/*  </PopoverClose>*/}
        {/*</div>*/}
        <Command>
          <CommandList>
            <CommandGroup heading="My Jobs">
              <CommandItem
                onSelect={() =>
                  setFilters({ ...filters, myJobs: !filters.myJobs })
                }
              >
                {filters.myJobs ? "☑" : "☐"} My Jobs
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Job Status">
              {statusOptions.map((state) => (
                <CommandItem
                  key={state}
                  onSelect={() => toggle("status", state)}
                >
                  {state}
                  {filters.status.includes(state) && (
                    <Badge variant="secondary" className="ml-2">
                      ✓
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Resources">
              {resourceOptions.map((res) => (
                <CommandItem key={res} onSelect={() => toggle("resource", res)}>
                  {res.toUpperCase()}
                  {filters.resource.includes(res) && (
                    <Badge variant="secondary" className="ml-2">
                      ✓
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPanel;
