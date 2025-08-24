import { cn } from "@/lib/utils";
import type { JobState } from "@/types/type";

type Variant = "status" | "resource" | "partition";
type Mode = "static" | "interactive";

const statusColors: Record<JobState, string> = {
  RUNNING: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  FAILED: "bg-rose-100 text-rose-700",
  COMPLETED: "bg-sky-100 text-sky-700",
  TIMEOUT: "bg-violet-100 text-violet-700",
  CANCELLED: "bg-gray-200 text-gray-700",
};

const variantColor = (variant: Variant, label: string): string => {
  if (variant === "status") {
    return statusColors[label as JobState] || "bg-gray-200 text-gray-700";
  }
  if (variant === "resource") {
    return "bg-neutral-800 text-white dark:bg-neutral-700";
  }
  if (variant === "partition") {
    return "bg-yellow-200 text-yellow-900";
  }
  return "";
};

export function Badge({
  label,
  variant,
  mode = "static",
  onClear,
  className,
}: {
  label: string;
  variant: Variant;
  mode?: Mode;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        variantColor(variant, label),
        className,
      )}
    >
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
        >
          {/*<X className="h-3.5 w-3.5" />*/}
        </span>
      )}
    </span>
  );
}
