import { useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router";
import { AccessTokenType } from "@/types/type";
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

    setCookiesForAuthToken(accessToken, refreshToken);

    let redirectTo;
    if (jwtDecode<AccessTokenType>(accessToken).Role === "ROLE_NOT_SETUP") {
      redirectTo = "/onboading";
    } else {
      redirectTo = "/";
    }

    navigate(redirectTo);
    toast.success(t("callback.loginSuccessToast"));
  }, [navigate, setCookiesForAuthToken, location, t]);

  return <div className="min-h-screen">{t("callback.loadingMessage")}</div>;
}
