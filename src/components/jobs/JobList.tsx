import React from "react";
import { Job } from "@/types/type";
import { Badge } from "@/components/ui/badge";

export interface JobListProps {
  jobs: Job[];
}

const stateColor: Record<Job["state"], string> = {
  RUNNING: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  FAILED: "bg-red-100 text-red-800",
};

const JobList: React.FC<JobListProps> = ({ jobs }) => (
  <table className="w-full border mt-4">
    <thead>
      <tr className="bg-gray-50">
        <th className="border px-3 py-2">ID</th>
        <th className="border px-3 py-2">State</th>
        <th className="border px-3 py-2">User</th>
        <th className="border px-3 py-2">Partition</th>
        <th className="border px-3 py-2">CPU</th>
        <th className="border px-3 py-2">GPU</th>
        <th className="border px-3 py-2">Mem</th>
      </tr>
    </thead>
    <tbody>
      {jobs.map((job) => (
        <tr key={job.id} className="hover:bg-gray-100">
          <td className="border px-3 py-2">{job.id}</td>
          <td className="border px-3 py-2">
            <Badge className={stateColor[job.state]}>{job.state}</Badge>
          </td>
          <td className="border px-3 py-2">{job.user}</td>
          <td className="border px-3 py-2">{job.partition}</td>
          <td className="border px-3 py-2">{job.resources.cpu}</td>
          <td className="border px-3 py-2">{job.resources.gpu}</td>
          <td className="border px-3 py-2">{job.resources.mem} MB</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default JobList;
