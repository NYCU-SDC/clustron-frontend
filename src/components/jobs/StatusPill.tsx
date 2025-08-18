import { cn } from "@/lib/utils";

export type JobState =
  | "RUNNING"
  | "PENDING"
  | "FAILED"
  | "COMPLETED"
  | "TIMEOUT"
  | "CANCELLED";

export const JOB_STATUS_COLORS: Record<JobState, string> = {
  RUNNING: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  FAILED: "bg-rose-100 text-rose-700",
  COMPLETED: "bg-sky-100 text-sky-700",
  TIMEOUT: "bg-violet-100 text-violet-700",
  CANCELLED: "bg-gray-200 text-gray-700",
};

export function StatusPill({
  state,
  className,
}: {
  state: JobState;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        JOB_STATUS_COLORS[state],
        className,
      )}
    >
      {state}
    </span>
  );
}
