import StateCard from "@/components/jobs/StateCard";
import { useJobCounts } from "@/hooks/useJobCounts";

export default function CountsBar() {
  const { data, isError } = useJobCounts();

  if (isError) {
    return (
      <div className="mb-4 text-sm text-red-500">
        Failed to load job counts.
      </div>
    );
  }

  if (!data) return null;

  const counts = data;

  return (
    <div className="mb-4 flex flex-wrap gap-6">
      <StateCard value={counts.running} label="Jobs running" />
      <StateCard value={counts.pending} label="Jobs pending" />
    </div>
  );
}
