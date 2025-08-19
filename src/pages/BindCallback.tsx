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
      window.opener.postmessage({ type: "BIND_FAIL" });
      return;
    }

    window.opener.postmessage({ type: "BIND_SUCCESS" });
  }, [navigate, location, t]);

  return <div className="min-h-screen">{t("callback.loadingMessage")}</div>;
}
