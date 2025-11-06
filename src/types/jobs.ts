//jobs
export type JobState =
  | "RUNNING"
  | "PENDING"
  | "FAILED"
  | "COMPLETED"
  | "TIMEOUT"
  | "CANCELLED";

export interface Resources {
  cpu: number;
  gpu: number;
  memory: number;
}

export interface Job {
  id: number;
  status: JobState;
  user: string;
  partition: string;
  resources: Resources;
}

export type SortBy =
  | "id"
  | "user"
  | "partition"
  | "status"
  | "cpu"
  | "gpu"
  | "memory";

export interface FilterOptions {
  status: JobState[];
  resource: ("cpu" | "gpu")[];
  partition: string[];
}
