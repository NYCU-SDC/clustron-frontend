import { useContext, useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { authContext } from "@/lib/auth/authContext";
import { jwtDecode } from "jwt-decode";
import { AccessToken } from "@/types/type";
import { getAccessTokenFromCookies } from "@/lib/getAccessTokenFromCookies";

export default function ProtectedRoute({
  showLoginRequiredToast = true,
}: {
  showLoginRequiredToast?: boolean;
}) {
  const { isLoggedIn } = useContext(authContext);
  const [token, setToken] = useState<string | null>(
    getAccessTokenFromCookies(),
  );
  const [role, setRole] = useState<string | undefined>(
    token ? jwtDecode<AccessToken>(token).Role : undefined,
  );
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    setToken(getAccessTokenFromCookies());
    setRole(token ? jwtDecode<AccessToken>(token).Role : undefined);
    if (!isLoggedIn() && window.location.pathname !== "/login") {
      navigate("/login");
      if (showLoginRequiredToast) {
        toast.warning(t("protectedRoute.loginRequiredToast"));
      }
      return;
    }

    if (role == "role_not_setup" && window.location.pathname != "/onboarding") {
      navigate("/onboarding");
      toast.warning(t("protectedRoute.roleNotSetupToast"));
      return;
    }
  }, [showLoginRequiredToast, isLoggedIn, navigate, role, token, t]);

  if (
    // no logged in but go to protected page, or
    !isLoggedIn() ||
    // logged in and role is not set up but go to protected page
    (role == "role_not_setup" && window.location.pathname != "/onboarding")
  ) {
    // early return so <Outlet> would not be rendered
    return null;
  }

  return <Outlet />;
}
