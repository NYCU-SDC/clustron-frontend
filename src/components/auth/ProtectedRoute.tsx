import { useContext, useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { authContext } from "@/lib/auth/authContext";
import { jwtDecode } from "jwt-decode";
import { AccessToken } from "@/types/type";
import { getAccessTokenFromCookies } from "@/lib/getAccessTokenFromCookies";

export default function ProtectedRoute({
  showNotLoggedInToast = true,
}: {
  showNotLoggedInToast?: boolean;
}) {
  const token = getAccessTokenFromCookies();
  const { isLoggedIn } = useContext(authContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoggedIn() && window.location.pathname !== "/login") {
      navigate("/login");
      if (showNotLoggedInToast) {
        toast.warning(t("protectedRoute.notLoggedInToast"));
      }
      return;
    }

    if (
      isLoggedIn() &&
      token &&
      jwtDecode<AccessToken>(token).Role == "role_not_setup"
    ) {
      navigate("/onboarding");
      toast.warning(t("Please finish onboarding form"));
      return;
    }
  }, [showNotLoggedInToast, isLoggedIn, navigate, t, token]);

  if (!isLoggedIn()) return null;

  return <Outlet />;
}
