import { useContext, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { authContext } from "@/lib/auth/authContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useContext(authContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  // const hasRun = useRef(false);

  useEffect(() => {
    // if (hasRun.current) return;
    // hasRun.current = true;
    if (!isLoggedIn()) {
      navigate("/login");
      toast.warning(t("protectedRoute.notLoggedInToast"));
    }
  }, [isLoggedIn, navigate, t]);

  if (!isLoggedIn()) return null;

  return children;
}
