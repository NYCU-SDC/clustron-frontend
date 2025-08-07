// ('/api/jobs', {
//     params: {
//       // 'true'/'false'
//       myJobs,
//       // status=RUNNING&status=FAILED&...
//       status,
//       // resource=cpu&resource=gpu
//       resource,
//       // 欄位
//       sortBy,
//       // 排序方向 asc or desc
//       sortOrder,
//     },
import { useState, useMemo } from "react";
import JobList from "@/components/jobs/JobList";
import SortSelector from "@/components/jobs/SortSelector";
import FilterPanel from "@/components/jobs/FilterPanel";
import jobsData from "@/lib/mock/jobs.ts";
import { SortBy, FilterOptions } from "@/types/type";

import { Badge } from "@/components/ui/badge";

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
      data = data.filter((job) => filters.status.includes(job.state));
    if (filters.resource.length) {
      data = data.filter((job) =>
        filters.resource.some((res) => job.resources[res] > 0),
      );
    }
    data.sort((a, b) => {
      const aVal = (
        sortBy in a.resources ? a.resources[sortBy as any] : a[sortBy as any]
      ) as unknown;
      const bVal = (
        sortBy in b.resources ? b.resources[sortBy as any] : b[sortBy as any]
      ) as unknown;
      if (typeof aVal === "string" || typeof bVal === "string") {
        return (
          String(aVal).localeCompare(String(bVal)) *
          (sortOrder === "asc" ? 1 : -1)
        );
      }
      return (
        ((aVal as number) - (bVal as number)) * (sortOrder === "asc" ? 1 : -1)
      );
    });
    return data;
  }, [filters, sortBy, sortOrder]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <SortSelector
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        <FilterPanel filters={filters} setFilters={setFilters} />
      </div>

      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.myJobs && (
          <Badge variant="secondary" className="flex items-center">
            My Jobs
            <button
              className="ml-1"
              onClick={() => setFilters({ ...filters, myJobs: false })}
            >
              ×
            </button>
          </Badge>
        )}
        {filters.status.map((s) => (
          <Badge key={s} variant="secondary" className="flex items-center">
            {s}
            <button
              className="ml-1"
              onClick={() =>
                setFilters({
                  ...filters,
                  status: filters.status.filter((v) => v !== s),
                })
              }
            >
              ×
            </button>
          </Badge>
        ))}
        {filters.resource.map((r) => (
          <Badge key={r} variant="secondary" className="flex items-center">
            {r.toUpperCase()}
            <button
              className="ml-1"
              onClick={() =>
                setFilters({
                  ...filters,
                  resource: filters.resource.filter((v) => v !== r),
                })
              }
            >
              ×
            </button>
          </Badge>
        ))}
      </div>

      <JobList jobs={filteredJobs} />
    </div>
  );
};

export default JobDashboard;
