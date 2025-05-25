import { useEffect, useCallback, ReactNode } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { AccessTokenType } from "@/types/type";
import { refreshAuthToken } from "@/lib/request/refreshAuthToken";
import { authContext } from "@/lib/auth/authContext";
import { toast } from "sonner";

let accessTimer: number;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [cookies, setCookie, removeCookie] = useCookies([
    "accessToken",
    "refreshTokenExpirationTime",
    "refreshToken",
  ]);

  const accessToken = cookies.accessToken || null;
  const refreshToken = cookies.refreshToken || null;

  const clearTimers = useCallback(() => {
    clearTimeout(accessTimer);
  }, []);

  const login = useCallback((provider: "google" | "nycu") => {
    const callbackUrl = `${window.location.protocol}//${window.location.host}/callback`;
    const redirectUrl = `${window.location.protocol}//${window.location.host}/`;
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

    const urlMap: Record<"google" | "nycu", string> = {
      google: `${baseUrl}/api/login/oauth/google?c=${callbackUrl}&r=${redirectUrl}`,
      nycu: `${baseUrl}/api/login/oauth/nycu?c=${callbackUrl}&r=${redirectUrl}`,
    };
    window.location.href = urlMap[provider];
  }, []);

  const logout = useCallback(() => {
    removeCookie("accessToken", { path: "/" });
    removeCookie("refreshTokenExpirationTime", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
    clearTimers();
    navigate("login");
    toast(t("authProvider.logoutToast"));
  }, [clearTimers, navigate, removeCookie, t]);

  const isLoggedIn = useCallback(() => {
    if (cookies.accessToken) {
      return true;
    }
    return false;
  }, [cookies.accessToken]);

  const setAutoRefresh = useCallback(
    (accessToken: string, refreshToken: string) => {
      clearTimers();
      // get accessToken Expiration time
      const accessExpirationTime =
        jwtDecode<AccessTokenType>(accessToken).exp * 1000;

      // calculate how long to update accessToken
      const timeUntilAccessExpiration = Math.min(
        accessExpirationTime - Date.now() - 60 * 1000,
        2147483647,
      );

      // set a timer to update both token
      if (timeUntilAccessExpiration > 0) {
        accessTimer = window.setTimeout(async () => {
          const data = await refreshAuthToken(refreshToken);
          if (!data) {
            logout();
            return;
          }
          setCookie("accessToken", data.accessToken, { path: "/" });
          setCookie("refreshTokenExpirationTime", data.expirationTime, {
            path: "/",
          });
          setCookie("refreshToken", data.refreshToken, { path: "/" });
        }, timeUntilAccessExpiration);
      } else {
        // assume user haven't open the clustron website for a long time so timeUntilAccessExpiration < 0
        // it need to update both token immediately
        (async () => {
          const data = await refreshAuthToken(refreshToken);
          if (!data) {
            logout();
            return;
          }
          setCookie("accessToken", data.accessToken, { path: "/" });
          setCookie("refreshTokenExpirationTime", data.expirationTime, {
            path: "/",
          });
          setCookie("refreshToken", data.refreshToken, { path: "/" });
        })();
      }

      // calculate how long does refreshToken expired
      const refreshExpirationTime = cookies.refreshTokenExpirationTime;
      if (refreshExpirationTime) {
        const timeUntilRefreshExpiration = Math.min(
          refreshExpirationTime * 1000 - Date.now(),
          2147483647,
        );
        if (timeUntilRefreshExpiration < 0) {
          logout();
        }
      }
    },
    [clearTimers, cookies.refreshTokenExpirationTime, logout, setCookie],
  );

  useEffect(() => {
    if (accessToken && refreshToken) {
      setAutoRefresh(accessToken, refreshToken);
    }
    return () => clearTimers();
  }, [accessToken, refreshToken, setAutoRefresh, clearTimers]);

  return (
    <authContext.Provider value={{ login, logout, isLoggedIn }}>
      {children}
    </authContext.Provider>
  );
};
