import { useState, useMemo } from "react";
import JobList from "@/components/jobs/JobList";
import SortSelector from "@/components/jobs/SortSelector";
import FilterPanel from "@/components/jobs/FilterPanel";
import { useQuery } from "@tanstack/react-query";
import { getJobs, type GetJobsParams } from "@/lib/request/jobs";
import type { SortBy, FilterOptions, JobState } from "@/types/jobs";
import CountsBar from "@/components/jobs/CountsBar";
import PaginationControls from "@/components/PaginationControl";

const PAGE_SIZE = 10;

const JobDashboard: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortBy>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    resource: [],
    partition: [],
  });
  const [currentPage, setCurrentPage] = useState(0);

  const listParams = useMemo<GetJobsParams>(() => {
    const base: GetJobsParams = {
      page: currentPage,
      size: PAGE_SIZE,
      sortBy,
      sort: sortOrder,
    };
    if (filters.partition.length === 1) {
      base.filterBy = "partition";
      base.filterValue = filters.partition[0];
    } else if (filters.status.length === 1) {
      base.filterBy = "status";
      base.filterValue = filters.status[0];
    }
    return base;
  }, [currentPage, sortBy, sortOrder, filters]);

  const { data } = useQuery({
    queryKey: ["jobs", listParams],
    queryFn: () => getJobs(listParams),
    placeholderData: (prev) => prev,
    staleTime: 10_000,
  });

  const jobs =
    data?.items?.map((j) => ({
      id: j.id,
      status: j.status as JobState,
      user: j.user,
      partition: j.partition,
      resources: j.resources, // { cpu, gpu, memory }
    })) ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <main className="flex-1 flex justify-center">
      <div className="p-6 space-y-4 max-w-4xl w-full">
        <CountsBar />
        {/* Toolbar */}
        <div className="flex flex-col gap-2">
          <SortSelector
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <FilterPanel filters={filters} setFilters={setFilters} />
        </div>
        {/* Job list */}
        <JobList jobs={jobs} />
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default JobDashboard;
