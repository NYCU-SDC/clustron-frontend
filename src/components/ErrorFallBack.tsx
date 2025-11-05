import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export default function ErrorFallBack() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-red-200 p-2">
      <ExclamationTriangleIcon className="size-32 text-red-500" />
      <div className="text-4xl font-bold text-red-500">Error</div>
      <div className="font-medium text-red-500">請嘗試重新整理頁面</div>
      <div className="font-medium text-red-500">
        若錯誤持續發生，請
        <Link
          to="mailto:contact@commonground.tw"
          className="inline underline decoration-solid decoration-2"
        >
          聯繫我們
        </Link>
      </div>
    </div>
  );
}
