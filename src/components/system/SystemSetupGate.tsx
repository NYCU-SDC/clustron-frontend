import { useEffect, useState, useCallback } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSetupStatus, isSetupComplete } from "@/lib/request/getSetupStatus";

const SETUP_PATH = "/system-setup";

function ConnectionErrorScreen({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-6 text-gray-800">
      <div className="mb-4 rounded-full bg-red-100 p-4 text-red-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-bold">{t("connectionError.title")}</h2>
      <p className="mb-6 text-center text-sm text-gray-600">
        {t("connectionError.description")}
      </p>
      <button
        onClick={onRetry}
        className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        {t("connectionError.retryBtn")}
      </button>
    </div>
  );
}

export default function SystemSetupGate() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [setupDone, setSetupDone] = useState<boolean | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const pathname = location.pathname;

  const isJustFinished = location.state?.setupSuccess === true;

  const allowList =
    pathname.startsWith(SETUP_PATH) ||
    pathname === "/health" ||
    isJustFinished ||
    ["/callback", "/callback/login", "/callback/bind"].includes(pathname);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setSetupDone(null);
    setRetryCount((c) => c + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);

      try {
        const data = await getSetupStatus();
        const done = isSetupComplete(data.progress);
        if (!cancelled) setSetupDone(done);
      } catch (e) {
        console.error("[SystemSetupGate] failed to get setup status", e);
        if (!cancelled) setSetupDone(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, retryCount]);

  if (loading) return null;

  if (setupDone === null) {
    return <ConnectionErrorScreen onRetry={handleRetry} />;
  }

  if (!setupDone && !allowList) {
    return <Navigate to={SETUP_PATH} replace />;
  }

  if (setupDone && pathname.startsWith(SETUP_PATH)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
