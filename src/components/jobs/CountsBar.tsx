import StateCard from "@/components/jobs/StateCard";
import { useJobCounts } from "@/hooks/useJobCounts";

export default function CountsBar() {
  const { data, isError } = useJobCounts(); //TODO: use GET /api/jobs/counts here

  if (isError) {
    return (
      <div className="mb-4 text-sm text-red-500">
        Failed to load job counts.
      </div>
    );
  }

  const counts = data ?? {
    running: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    timeout: 0,
    cancelled: 0,
  };

  return (
    <div className="mb-4 flex flex-wrap gap-6">
      <StateCard value={counts.running} label="Jobs running" />
      <StateCard value={counts.pending} label="Jobs pending" />
    </div>
  );
}
