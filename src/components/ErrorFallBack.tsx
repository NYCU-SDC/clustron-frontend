import { FallbackProps } from "react-error-boundary";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";

interface ErrorFallBackProps extends FallbackProps {
  isInline?: boolean;
}

export default function ErrorFallBack({
  error,
  resetErrorBoundary,
  isInline = false,
}: ErrorFallBackProps) {
  if (isInline) {
    return (
      <Button
        variant="ghost"
        onClick={resetErrorBoundary}
        className="text-base text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 h-auto rounded-lg gap-1"
        title={error?.message || "Error"}
      >
        <ExclamationTriangleIcon className="w-5 h-5" />
        <span>Retry</span>
      </Button>
    );
  }

  return (
    <div
      role="alert"
      className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-3 p-4 text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-md"
    >
      <div className="flex items-center gap-2">
        <ExclamationTriangleIcon className="w-5 h-5" />
        <span className="font-bold text-base">Something Went Wrong</span>
      </div>

      <p className="text-xs text-center text-red-400 break-all max-w-[80%]">
        {error.message || "An Unknown Error Has Occurred"}
      </p>

      <Button
        variant="destructive"
        onClick={resetErrorBoundary}
        className="mt-2"
      >
        Retry
      </Button>
    </div>
  );
}
