import { useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router";
import { AccessToken } from "@/types/settings";
import { authContext } from "@/lib/auth/authContext";

export default function Callback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCookiesForAuthToken } = useContext(authContext);
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("token");
    const refreshToken = params.get("refreshToken");
    const error = params.get("error");

    if (!accessToken || !refreshToken || error) {
      navigate("/login");
      toast.error(t("callback.loginFailToast"));
      return;
    }

    setCookiesForAuthToken({
      accessToken: accessToken,
      refreshToken: refreshToken,
      expirationTime: Date.now() + 60 * 60 * 24 * 1000,
    });

    let redirectTo;
    if (jwtDecode<AccessToken>(accessToken).Role === "role_not_setup") {
      redirectTo = "/onboarding";
    } else {
      redirectTo = "/";
    }

    navigate(redirectTo);
    toast.success(t("callback.loginSuccessToast"));
  }, [navigate, setCookiesForAuthToken, location, t]);

  return <div className="min-h-screen">{t("callback.loadingMessage")}</div>;
}
