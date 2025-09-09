import { type JobState } from "@/types/jobs";
import { Badge } from "@/components/jobs/Badge.tsx";

type Job = {
  id: number;
  status: JobState;
  user: string;
  partition: string;
  resources: { cpu: number; gpu: number; memory: number };
};

export default function JobList({ jobs }: { jobs: Job[] }) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="[&>th]:py-3 [&>th]:px-4 [&>th]:text-left">
              <th className="w-[80px]">#ID</th>
              <th className="w-[140px]">State</th>
              <th>User</th>
              <th>Partition</th>
              <th>Resources</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-b">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-muted/40">
                <td className="py-3 px-4 font-medium">{job.id}</td>
                <td className="py-3 px-4">
                  <Badge label={job.status} variant="status" />
                </td>
                <td className="py-3 px-4">{job.user}</td>
                <td className="py-3 px-4">{job.partition}</td>
                <td className="py-3 px-4">
                  <div className="flex items-baseline gap-4">
                    <span>
                      <span className="font-semibold">{job.resources.cpu}</span>{" "}
                      <span className="text-xs align-bottom">CPU</span>
                    </span>
                    <span>
                      <span className="font-semibold">{job.resources.gpu}</span>{" "}
                      <span className="text-xs align-bottom">GPU</span>
                    </span>
                    <span>
                      <span className="font-semibold">
                        {formatMem(job.resources.memory)}
                      </span>{" "}
                      <span className="text-xs align-bottom">Mem</span>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatMem(mbOrGb: number) {
  return `${mbOrGb}GB`;
}
