import { api } from "@/lib/request/api";

// item shape of GET /api/jobs.items
export type Job = {
  id: number;
  name: string;
  comment: string;
  status:
    | "RUNNING"
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "TIMEOUT"
    | "CANCELLED"
    | string;
  user: string;
  partition: string;
  resources: {
    cpu: number;
    memory: number;
    gpu: number;
  };
};

// response envelope of GET /api/jobs
export type JobsPage = {
  items: Job[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
};

// shape of GET /api/jobs/counts
export type JobCounts = {
  running: number;
  pending: number;
  completed: number;
  failed: number;
  timeout: number;
  cancelled: number;
};

// shape of GET /api/partitions
export type Partitions = {
  partitions: string[];
};

// body of POST /api/jobs
export type JobCreatePayload = {
  name?: string;
  comment?: string;
  current_working_directory?: string;
  script?: string;
  environment?: string[];
  nodes?: string;
  minimum_nodes?: number;
  maximum_nodes?: number;
  tasks?: number;
  cpus_per_task?: number;
  memory_per_cpu?: number;
  memory_per_node?: number;
  partition?: string;
  time_limit?: number;
  standard_input?: string;
  standard_output?: string;
  standard_error?: string;
};

// GET /api/jobs
export async function getJobs(params?: {
  page?: number;
  size?: number;
  sort?: "asc" | "desc";
  sortBy?: string;
  filterBy?: string;
  filterValue?: string;
}): Promise<JobsPage> {
  const q = new URLSearchParams();
  if (params?.page != null) q.set("page", String(params.page));
  if (params?.size != null) q.set("size", String(params.size));
  if (params?.sort) q.set("sort", params.sort);
  if (params?.sortBy) q.set("sortBy", params.sortBy);
  if (params?.filterBy) q.set("filterBy", params.filterBy);
  if (params?.filterValue) q.set("filterValue", params.filterValue);

  const path = q.toString() ? `/api/jobs?${q.toString()}` : "/api/jobs";
  return api(path);
}

// GET /api/jobs/counts
export async function getJobCounts(status?: Job["status"]): Promise<JobCounts> {
  const path = status
    ? `/api/jobs/counts?status=${encodeURIComponent(status)}`
    : "/api/jobs/counts";
  return api(path);
}

// GET /api/partitions
export async function getPartitions(): Promise<Partitions> {
  return api("/api/partitions");
}

// POST /api/jobs
export async function createJob(payload: JobCreatePayload): Promise<Job> {
  return api("/api/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
