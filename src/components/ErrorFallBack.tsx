import { FallbackProps } from "react-error-boundary";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function ErrorFallBack({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div
      role="alert"
      className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-3 p-4 text-red-500 bg-red-50 border border-red-200 rounded-md"
    >
      <div className="flex items-center gap-2">
        <ExclamationTriangleIcon className="w-5 h-5" />
        <span className="font-bold text-base">載入失敗</span>
      </div>

      <p className="text-xs text-center text-red-400 break-all max-w-[80%]">
        {error.message || "發生未知錯誤"}
      </p>

      <button
        onClick={resetErrorBoundary}
        className="px-4 py-1 mt-2 text-sm text-white transition-colors bg-red-500 rounded hover:bg-red-600"
      >
        重試
      </button>
    </div>
  );
}
