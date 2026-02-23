import { useEffect, useState, useCallback } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSetupStatus, isSetupComplete } from "@/lib/request/getSetupStatus";
import ErrorFallBack from "@/components/ErrorFallBack";
import { Loader2 } from "lucide-react";

const SETUP_PATH = "/system-setup";

export default function SystemSetupGate() {
  const location = useLocation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [setupDone, setSetupDone] = useState<boolean | null>(null);

  const fetchSetupStatus = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSetupStatus();
      setSetupDone(isSetupComplete(data.progress));
    } catch (e) {
      console.error("[SystemSetupGate] failed to get setup status", e);
      setSetupDone(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    fetchSetupStatus();
  }, [fetchSetupStatus]);

  useEffect(() => {
    fetchSetupStatus();
  }, [fetchSetupStatus]);

  // 【請你改動這裡：換成真正的旋轉動畫】
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (setupDone === null) {
    return (
      <ErrorFallBack
        error={new Error(t("connectionError.description"))}
        resetErrorBoundary={handleRetry}
      />
    );
  }

  if (!setupDone) {
    return <Navigate to={SETUP_PATH} replace />;
  }

  if (setupDone && location.pathname.startsWith(SETUP_PATH)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
