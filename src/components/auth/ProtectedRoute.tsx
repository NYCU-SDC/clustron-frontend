import { useContext, useEffect, useRef } from "react";
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
  const navigate = useNavigate();
  const { t } = useTranslation();

  const token = useRef<string | null>(getAccessTokenFromCookies());
  const role = useRef<string | undefined>(
    token.current ? jwtDecode<AccessToken>(token.current).Role : undefined,
  );

  const updateTokenAndRole = () => {
    const newToken = getAccessTokenFromCookies();

    if (newToken !== token.current) {
      token.current = newToken;
      role.current = newToken
        ? jwtDecode<AccessToken>(newToken).Role
        : undefined;
    }
  };

  useEffect(() => {
    updateTokenAndRole();

    if (!isLoggedIn() && window.location.pathname !== "/login") {
      navigate("/login");
      if (showLoginRequiredToast) {
        toast.warning(t("protectedRoute.loginRequiredToast"));
      }
      return;
    }

    if (
      role.current == "role_not_setup" &&
      window.location.pathname != "/onboarding"
    ) {
      navigate("/onboarding");
      toast.warning(t("protectedRoute.roleNotSetupToast"));
      return;
    }
  }, [showLoginRequiredToast, isLoggedIn, navigate, t]);

  if (
    // no logged in but go to protected page, or
    !isLoggedIn() ||
    // logged in and role is not set up but go to protected page
    (role.current == "role_not_setup" &&
      window.location.pathname != "/onboarding")
  ) {
    return null;
  }

  return <Outlet />;
}
