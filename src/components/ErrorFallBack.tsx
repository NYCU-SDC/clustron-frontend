import { FallbackProps } from "react-error-boundary";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function ErrorFallBack({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div
      role="alert"
      className="flex items-center gap-2 p-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md"
    >
      <ExclamationTriangleIcon className="w-4 h-4" />

      <span className="font-medium">載入失敗</span>

      <button
        onClick={resetErrorBoundary}
        className="px-2 py-0.5 text-xs text-white bg-red-500 rounded hover:bg-red-600"
      >
        重試
      </button>

      <span className="hidden">{error.message}</span>
    </div>
  );
}
