import { useContext, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { authContext } from "@/lib/auth/authContext";

export default function ProtectedRoute({
  children,
  showNotLoggedInToast = true,
}: {
  children: ReactNode;
  showNotLoggedInToast?: boolean;
}) {
  const { isLoggedIn } = useContext(authContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoggedIn() && window.location.pathname !== "/login") {
      navigate("/login");
      if (showNotLoggedInToast) {
        toast.warning(t("protectedRoute.notLoggedInToast"));
      }
    }
  }, [showNotLoggedInToast, isLoggedIn, navigate, location, t]);

  if (!isLoggedIn()) return null;

  return children;
}
