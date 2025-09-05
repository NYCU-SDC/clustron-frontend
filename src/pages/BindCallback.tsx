import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router";

export default function BindCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("token");
    const refreshToken = params.get("refreshToken");
    const error = params.get("error");

    if (!accessToken || !refreshToken || error) {
      if (error?.includes("conflict")) {
        window.opener?.postMessage({ type: "BIND_CONFLICT" });
      } else {
        window.opener?.postMessage({ type: "BIND_FAIL" });
      }
      window.close();
      return;
    }

    window.opener?.postMessage({ type: "BIND_SUCCESS" }, "*");
    window.close();
  }, [navigate, location, t]);

  return <div className="min-h-screen">{t("callback.loadingMessage")}</div>;
}
