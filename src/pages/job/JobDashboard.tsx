import { useState } from "react";
import JobList from "@/components/jobs/JobList";
import SortSelector from "@/components/jobs/SortSelector";
import FilterPanel from "@/components/jobs/FilterPanel";
import { useGetJobs } from "@/hooks/useGetJobs";
import type { Job as ApiJob } from "@/lib/request/jobs";
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

  const { data } = useGetJobs(
    {
      page: currentPage + 1,
      size: PAGE_SIZE,
      sortBy: sortBy,
      sort: sortOrder,
      ...(filters.partition.length === 1
        ? { filterBy: "partition", filterValue: filters.partition[0] }
        : {}),
      ...(filters.status.length === 1
        ? { filterBy: "status", filterValue: filters.status[0] }
        : {}),
    },
    true,
  );

  const jobs =
    (data?.items as ApiJob[] | undefined)?.map((j) => ({
      id: j.id,
      status: j.status as JobState, // ← 關鍵：把較寬的 string union 縮成 JobState
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
        {/*  TODO: use /api/jobs API returned from backend  */}
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
