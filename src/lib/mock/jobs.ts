import { Job } from "@/types/type";

const jobsData: Job[] = [
  {
    id: 588,
    state: "RUNNING",
    user: "john",
    partition: "default",
    resources: { cpu: 2, gpu: 1, mem: 2048 },
  },
  {
    id: 123,
    state: "FAILED",
    user: "ANNIE",
    partition: "default",
    resources: { cpu: 0, gpu: 1, mem: 1024 },
  },
];

export default jobsData;
