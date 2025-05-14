import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { AccessTokenType } from "@/types/type";

export default function Callback() {
  const [, setCookie] = useCookies([
    "accessToken",
    "refreshTokenExpirationTime",
    "refreshToken",
  ]);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("token");
    const refreshToken = params.get("refreshToken");
    const error = params.get("error");

    if (!accessToken || !refreshToken || error) {
      navigate("/login");
      toast.error(t("callback.loginFailToast"));
      return;
    }

    setCookie("accessToken", accessToken, { path: "/" });
    setCookie("refreshToken", refreshToken, { path: "/" });
    setCookie(
      "refreshTokenExpirationTime",
      Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60,
      { path: "/" },
    );

    let redirectTo;
    if (jwtDecode<AccessTokenType>(accessToken).Role === "ROLE_NOT_SETUP") {
      redirectTo = "/onboading";
    } else {
      redirectTo = "/";
    }

    navigate(redirectTo);
    toast.success(t("callback.loginSuccessToast"));
  }, [mounted]);

  return <div className="min-h-screen">{t("callback.loadingMessage")}</div>;
}
