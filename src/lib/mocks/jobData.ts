// src/mocks/jobs.fixture.ts
export type JobState =
  | "RUNNING"
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "TIMEOUT"
  | "CANCELLED";

export type JobResponse = {
  id: number;
  name: string;
  comment: string;
  status: JobState;
  user: string;
  partition: string;
  resources: { cpu: number; memory: number; gpu: number };
};

export const jobsData: JobResponse[] = [
  {
    id: 588,
    name: "job-588",
    comment: "render",
    status: "RUNNING",
    user: "john",
    partition: "default",
    resources: { cpu: 2, gpu: 1, memory: 2048 },
  },
  {
    id: 583,
    name: "job-583",
    comment: "train",
    status: "RUNNING",
    user: "john",
    partition: "default",
    resources: { cpu: 2, gpu: 1, memory: 1024 },
  },
  {
    id: 345,
    name: "job-345",
    comment: "etl",
    status: "RUNNING",
    user: "john",
    partition: "compute",
    resources: { cpu: 2, gpu: 1, memory: 300 },
  },
  {
    id: 456,
    name: "job-456",
    comment: "prep",
    status: "PENDING",
    user: "john",
    partition: "compute",
    resources: { cpu: 10, gpu: 0, memory: 2048 },
  },
  {
    id: 777,
    name: "job-777",
    comment: "viz",
    status: "FAILED",
    user: "alex",
    partition: "default",
    resources: { cpu: 0, gpu: 10, memory: 200000 },
  },
];

export const PARTITIONS_FIXTURE = ["default", "compute", "gpu"];
