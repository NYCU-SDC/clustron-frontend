import { cn } from "@/lib/utils";
import type { JobState } from "@/types/jobs";

const STATUS_COLORS: Record<JobState, string> = {
  RUNNING: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  FAILED: "bg-rose-100 text-rose-700",
  COMPLETED: "bg-sky-100 text-sky-700",
  TIMEOUT: "bg-violet-100 text-violet-700",
  CANCELLED: "bg-gray-200 text-gray-700",
};

type Props = {
  label: string;
  variant: "status" | "resource" | "partition";
  mode?: "static" | "interactive";
  onClear?: () => void;
};

export function Badge({ label, variant, mode = "static", onClear }: Props) {
  const baseStyle =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold";

  const getVariantClass = () => {
    switch (variant) {
      case "status":
        return STATUS_COLORS[label as JobState] ?? "bg-gray-100 text-gray-700";
      case "resource":
        return "bg-neutral-800 text-white dark:bg-neutral-700";
      case "partition":
        return "bg-yellow-200 text-yellow-900";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span className={cn(baseStyle, getVariantClass())}>
      {label}
      {mode === "interactive" && onClear && (
        <span
          role="button"
          tabIndex={0}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClear();
          }}
          className="cursor-pointer"
        ></span>
      )}
    </span>
  );
}
