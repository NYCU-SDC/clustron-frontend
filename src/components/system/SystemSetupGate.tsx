import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSetupStatus, isSetupComplete } from "@/lib/request/getSetupStatus";

const SETUP_PATH = "/system-setup";

export default function SystemSetupGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [setupDone, setSetupDone] = useState<boolean | null>(null);

  const pathname = location.pathname;
  const allowList =
    pathname.startsWith(SETUP_PATH) ||
    pathname.startsWith("/callback") ||
    pathname.startsWith("/health");

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
  }, [pathname]);

  if (loading) return null;

  if (setupDone === null) return <>{children}</>;

  if (!setupDone && !allowList) {
    return <Navigate to={SETUP_PATH} replace />;
  }

  if (setupDone && pathname.startsWith(SETUP_PATH)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
