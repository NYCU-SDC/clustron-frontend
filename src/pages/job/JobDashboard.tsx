import { useState, useMemo } from "react";
import JobList from "@/components/jobs/JobList";
import SortSelector from "@/components/jobs/SortSelector";
import FilterPanel from "@/components/jobs/FilterPanel";
import { useQuery } from "@tanstack/react-query";
import { getJobs, JobsPage } from "@/lib/request/jobs";
import type { Job as APIJob } from "@/lib/request/jobs";
import type { SortBy, FilterOptions, JobState } from "@/types/jobs";
import CountsBar from "@/components/jobs/CountsBar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 3;

const JobDashboard: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortBy>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    resource: [],
    partition: [],
  });
  const [currentPage, setCurrentPage] = useState(0);

  type GetJobsParams = NonNullable<Parameters<typeof getJobs>[0]>;
  const listParams = useMemo<GetJobsParams>(() => {
    const base: GetJobsParams = {
      page: currentPage + 1,
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

  const { data } = useQuery<JobsPage>({
    queryKey: ["jobs", listParams],
    queryFn: () => getJobs(listParams),
    placeholderData: (prev) => prev,
    staleTime: 10_000,
  });

  const jobs =
    (data?.items as APIJob[] | undefined)?.map((j) => ({
      id: j.id,
      status: j.status as JobState,
      user: j.user,
      partition: j.partition,
      resources: j.resources, // { cpu, gpu, memory }
    })) ?? [];
  const totalPages = data?.totalPages ?? 0;

  const maxPages = 4;
  let startPage = Math.max(currentPage - 1, 0);
  let endPage = startPage + maxPages - 1;
  if (endPage >= totalPages) {
    endPage = totalPages - 1;
    startPage = Math.max(endPage - maxPages + 1, 0);
  }

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
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                    className={
                      currentPage === 0 ? "opacity-50 pointer-events-none" : ""
                    }
                  />
                </PaginationItem>
                {startPage > 0 && (
                  <PaginationItem>
                    <span className="px-2">...</span>
                  </PaginationItem>
                )}
                {Array.from(
                  { length: endPage - startPage + 1 },
                  (_, i) => startPage + i,
                ).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {endPage < totalPages - 1 && (
                  <PaginationItem>
                    <span className="px-2">...</span>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
                    }
                    className={
                      currentPage === totalPages - 1
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </main>
  );
};

export default JobDashboard;
