// src/mocks/jobs.logic.ts
import { jobsData, type JobResponse } from "@/lib/mocks/jobData";

export type ListJobsQuery = {
  page?: number;
  pageSize?: number;
  sortBy?:
    | "id"
    | "name"
    | "comment"
    | "status"
    | "user"
    | "partition"
    | "cpu"
    | "gpu"
    | "memory";
  sortOrder?: "asc" | "desc";
  filterBy?: string; // e.g. "status" | "user" | "resources.gpu"
  filterValue?: string; // e.g. "RUNNING" | "john" | "1"
};

type PaginatedResponse<T> = {
  items: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
};

function applyFilter(data: JobResponse[], q: ListJobsQuery) {
  const { filterBy, filterValue } = q;
  if (!filterBy || !filterValue) return data;

  return data.filter((j: any) => {
    if (filterBy.startsWith("resources.")) {
      const key = filterBy.split(".")[1]; // cpu/gpu/memory
      return String(j.resources?.[key]) === String(filterValue);
    }
    return (
      String(j[filterBy])?.toLowerCase() === String(filterValue).toLowerCase()
    );
  });
}

function applySort(data: JobResponse[], q: ListJobsQuery) {
  const sortBy = q.sortBy ?? "id";
  const sortOrder = q.sortOrder ?? "asc";
  const dir = sortOrder === "asc" ? 1 : -1;

  const pick = (x: any) => {
    if (["cpu", "gpu", "memory"].includes(sortBy)) return x.resources?.[sortBy];
    return x[sortBy];
  };

  return [...data].sort((a, b) => {
    const av = pick(a),
      bv = pick(b);
    if (typeof av === "string" || typeof bv === "string") {
      return String(av).localeCompare(String(bv)) * dir;
    }
    return ((av as number) - (bv as number)) * dir;
  });
}

/** mock GET /api/jobs */
export function mockListJobs(q: ListJobsQuery): PaginatedResponse<JobResponse> {
  let data = [...jobsData];
  data = applyFilter(data, q);
  data = applySort(data, q);

  const page = q.page ?? 1;
  const pageSize = q.pageSize ?? 10;
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  const items = data.slice(start, end);
  const hasNextPage = currentPage < totalPages;

  return {
    items,
    totalPages,
    totalItems,
    currentPage,
    pageSize,
    hasNextPage,
  };
}

/** mock GET /api/jobs/counts */
export async function mockCountJobs(filter?: {
  filterBy?: string;
  filterValue?: string;
}) {
  let data = [...jobsData];
  if (filter?.filterBy && filter?.filterValue) {
    data = applyFilter(data, { ...filter });
  }
  const counts = {
    running: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    timeout: 0,
    cancelled: 0,
  };
  data.forEach((j) => {
    switch (j.status) {
      case "RUNNING":
        counts.running++;
        break;
      case "PENDING":
        counts.pending++;
        break;
      case "COMPLETED":
        counts.completed++;
        break;
      case "FAILED":
        counts.failed++;
        break;
      case "TIMEOUT":
        counts.timeout++;
        break;
      case "CANCELLED":
        counts.cancelled++;
        break;
    }
  });
  await new Promise((r) => setTimeout(r, 150));
  return counts;
}

/** mock GET /api/jobs/partitions */
export async function mockGetPartitions() {
  const { PARTITIONS_FIXTURE } = await import("./jobData");
  await new Promise((r) => setTimeout(r, 120));
  return PARTITIONS_FIXTURE;
}
