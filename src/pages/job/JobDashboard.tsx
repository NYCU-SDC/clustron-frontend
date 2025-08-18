import { useState, useMemo } from "react";
import JobList from "@/components/jobs/JobList";
import SortSelector from "@/components/jobs/SortSelector";
import FilterPanel from "@/components/jobs/FilterPanel";
import { jobsData } from "@/lib/mocks/jobData";
import type { SortBy, FilterOptions } from "@/types/type";
import CountsBar from "@/components/jobs/CountsBar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 5;

const JobDashboard: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortBy>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<FilterOptions>({
    myJobs: false,
    status: [],
    resource: [],
  });
  const [currentPage, setCurrentPage] = useState(0);
  const currentUser = "john";

  // sort
  const sortedAndFilteredJobs = useMemo(() => {
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

  // 再做分頁
  const totalPages = Math.ceil(sortedAndFilteredJobs.length / PAGE_SIZE);
  const paginatedJobs = useMemo(() => {
    const start = currentPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return sortedAndFilteredJobs.slice(start, end);
  }, [sortedAndFilteredJobs, currentPage]);

  // 分頁按鈕範圍控制
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
        <JobList jobs={paginatedJobs} />

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
