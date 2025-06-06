import { useContext, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { authContext } from "@/lib/auth/authContext";

export default function ProtectedRoute() {
  const { isLoggedIn } = useContext(authContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoggedIn() && window.location.pathname !== "/login") {
      navigate("/login");
      toast.warning(t("protectedRoute.notLoggedInToast"));
    }
  }, [isLoggedIn, navigate, location, t]);

  if (!isLoggedIn()) return null;

  return <Outlet />;
}
