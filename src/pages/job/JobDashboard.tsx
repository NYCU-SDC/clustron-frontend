import { useState, useMemo } from "react";
import JobList from "@/components/jobs/JobList";
import SortSelector from "@/components/jobs/SortSelector";
import FilterPanel from "@/components/jobs/FilterPanel";
import { jobsData, JobResponse } from "@/lib/mocks/jobData"; // TODO: change real api from backend
import type { SortBy, FilterOptions } from "@/types/jobs";
import CountsBar from "@/components/jobs/CountsBar";
import PaginationControls from "@/components/PaginationControl";

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

  //  TODO: use usestate to get /api/jobs data
  const sortedAndFilteredJobs = useMemo(() => {
    let data = [...jobsData]; //

    //  only in mock: filter data based on param handle in backend
    if (filters.partition.length)
      data = data.filter((job) => filters.partition.includes(job.partition));
    if (filters.status.length)
      data = data.filter((job) => filters.status.includes(job.status));
    if (filters.resource.length)
      data = data.filter((job) =>
        filters.resource.some((res) => job.resources[res] > 0),
      );

    //  only in mock: sort logic handle in backend
    data.sort((a: JobResponse, b: JobResponse) => {
      const isResourceKey = (key: string): key is keyof typeof a.resources => {
        return key === "cpu" || key === "gpu" || key === "memory";
      };

      const aVal = isResourceKey(sortBy)
        ? a.resources[sortBy]
        : a[sortBy as keyof JobResponse];
      const bVal = isResourceKey(sortBy)
        ? b.resources[sortBy]
        : b[sortBy as keyof JobResponse];

      const dir = sortOrder === "asc" ? 1 : -1;

      if (typeof aVal === "string" || typeof bVal === "string") {
        return String(aVal).localeCompare(String(bVal)) * dir;
      }

      return (Number(aVal) - Number(bVal)) * dir;
    });

    return data;
  }, [filters, sortBy, sortOrder]);

  // TODO: pagination handle in backend
  const totalPages = Math.ceil(sortedAndFilteredJobs.length / PAGE_SIZE);
  const paginatedJobs = useMemo(() => {
    const start = currentPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return sortedAndFilteredJobs.slice(start, end);
  }, [sortedAndFilteredJobs, currentPage]);

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
        <JobList jobs={paginatedJobs} />{" "}
        {/*  TODO: use /api/jobs API returned from backend  */}
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
