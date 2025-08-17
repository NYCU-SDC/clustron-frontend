import { useState, useMemo } from "react";
import JobList from "@/components/jobs/JobList";
import SortSelector from "@/components/jobs/SortSelector";
import FilterPanel from "@/components/jobs/FilterPanel";
import { jobsData } from "@/lib/mocks/jobs.fixture.ts";
import type { SortBy, FilterOptions } from "@/types/type";
import CountsBar from "@/components/jobs/CountsBar";

const JobDashboard: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortBy>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<FilterOptions>({
    myJobs: false,
    status: [],
    resource: [],
  });
  const currentUser = "john";

  const filteredJobs = useMemo(() => {
    let data = [...jobsData];
    if (filters.myJobs) data = data.filter((job) => job.user === currentUser);
    if (filters.status.length)
      data = data.filter((job) => filters.status.includes(job.status));
    if (filters.resource.length)
      data = data.filter((job) =>
        filters.resource.some((res) => job.resources[res] > 0),
      );
    data.sort((a, b) => {
      const pick = (x: any) =>
        sortBy in x.resources ? x.resources[sortBy as any] : x[sortBy as any];
      const aVal = pick(a);
      const bVal = pick(b);
      const dir = sortOrder === "asc" ? 1 : -1;
      if (typeof aVal === "string" || typeof bVal === "string")
        return String(aVal).localeCompare(String(bVal)) * dir;
      return ((aVal as number) - (bVal as number)) * dir;
    });
    return data;
  }, [filters, sortBy, sortOrder]);

  return (
    <main className="flex-1 flex  justify-center">
      <div className="p-6 space-y-4 max-w-4xl w-full">
        <CountsBar />
        {/* Toolbar */}
        <div className="flex flex-col gap-2 ">
          <SortSelector
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <FilterPanel filters={filters} setFilters={setFilters} />
        </div>

        <JobList jobs={filteredJobs} />
      </div>
    </main>
  );
};

export default JobDashboard;
