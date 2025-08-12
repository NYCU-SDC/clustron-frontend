import { cn } from "@/lib/utils";

type Job = {
  id: number;
  state:
    | "RUNNING"
    | "PENDING"
    | "FAILED"
    | "COMPLETED"
    | "TIMEOUT"
    | "CANCELLED";
  user: string;
  partition: string;
  resources: { cpu: number; gpu: number; mem: number }; // mem 單位 MB/GB 依你的 mock
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
                  <StatusPill state={job.state} />
                </td>
                <td className="py-3 px-4">{job.user}</td>
                <td className="py-3 px-4">{job.partition}</td>
                <td className="py-3 px-4">
                  <span className="font-semibold">{job.resources.cpu}</span>
                  {"  "}
                  <span>
                    <span className="text-xs align-super"> CPU</span>
                  </span>
                  {"  "}
                  <span className="font-semibold">{job.resources.gpu}</span>
                  {"  "}
                  <span className="text-xs align-super"> GPU</span>
                  {"  "}
                  <span className="font-semibold">
                    {formatMem(job.resources.mem)}
                  </span>{" "}
                  <span className="text-xs align-super"> Mem</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ state }: { state: Job["state"] }) {
  const map: Record<Job["state"], string> = {
    RUNNING: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    FAILED: "bg-rose-100 text-rose-700",
    COMPLETED: "bg-sky-100 text-sky-700",
    TIMEOUT: "bg-violet-100 text-violet-700",
    CANCELLED: "bg-gray-200 text-gray-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        map[state],
      )}
    >
      {state}
    </span>
  );
}

function formatMem(mbOrGb: number) {
  // 依你的 mock 決定：如果是 MB 就顯示 MB；這裡示例直接顯示數字＋GB
  return `${mbOrGb}GB`;
}
