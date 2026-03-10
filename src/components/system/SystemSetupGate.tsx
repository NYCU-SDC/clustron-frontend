import { useEffect, useState, useCallback } from "react";
import { Navigate, useLocation, Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { getSetupStatus, isSetupComplete } from "@/lib/request/getSetupStatus";
import ErrorFallBack from "@/components/ErrorFallBack";
import { Loader2 } from "lucide-react";

const SETUP_PATH = "/system-setup";

export default function SystemSetupGate() {
  const location = useLocation();
  const { t } = useTranslation();
  const [setupDone, setSetupDone] = useState(false);

  const {
    mutate: fetchSetupStatus,
    isPending,
    isError,
    isIdle,
  } = useMutation({
    mutationFn: getSetupStatus,
    onSuccess: (data) => {
      setSetupDone(isSetupComplete(data.progress));
    },
    onError: (error) => {
      console.error("[SystemSetupGate] failed to get setup status", error);
    },
  });

  const handleRetry = useCallback(() => {
    fetchSetupStatus();
  }, [fetchSetupStatus]);

  useEffect(() => {
    fetchSetupStatus();
  }, [fetchSetupStatus]);

  if (isPending || isIdle) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorFallBack
        error={new Error(t("connectionError.description"))}
        resetErrorBoundary={handleRetry}
      />
    );
  }

  const isSetupPage = location.pathname.startsWith(SETUP_PATH);

  if (setupDone) {
    if (isSetupPage) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }

  if (!setupDone) {
    if (isSetupPage) {
      return <Outlet />;
    }
    return <Navigate to={SETUP_PATH} replace />;
  }
}
