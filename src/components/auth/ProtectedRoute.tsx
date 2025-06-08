import { useContext, useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { authContext } from "@/lib/auth/authContext";

export default function ProtectedRoute({
  showNotLoggedInToast = true,
}: {
  showNotLoggedInToast?: boolean;
}) {
  const { isLoggedIn } = useContext(authContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoggedIn() && window.location.pathname !== "/login") {
      navigate("/login");
      if (showNotLoggedInToast) {
        toast.warning(t("protectedRoute.notLoggedInToast"));
      }
    }
  }, [showNotLoggedInToast, isLoggedIn, navigate, t]);

  if (!isLoggedIn()) return null;

  return <Outlet />;
}
