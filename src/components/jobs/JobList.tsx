import { DataTable } from "@/components/ui/data-table";
import { jobColumns } from "@/components/jobs/jobColumns";
import type { Job } from "@/types/jobs";

export default function JobList({ jobs }: { jobs: Job[] }) {
  return (
    <div className="rounded-lg border bg-card">
      <DataTable
        columns={jobColumns}
        data={jobs}
        getRowId={(job) => String(job.id)}
        className="[&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3"
        headerClassName="bg-muted/50 text-muted-foreground"
        rowClassName="hover:bg-muted/40"
      />
    </div>
  );
}
