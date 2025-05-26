import { useEffect, useCallback, ReactNode } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { AccessTokenType } from "@/types/type";
import { refreshAuthToken } from "@/lib/request/refreshAuthToken";
import { authContext } from "@/lib/auth/authContext";

let refreshTimer: number;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cookies, setCookie, removeCookie] = useCookies([
    "accessToken",
    "refreshToken",
  ]);

  const clearTimers = useCallback(() => {
    clearTimeout(refreshTimer);
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

  const setCookiesForAuthToken = useCallback(
    (
      accessToken: string,
      refreshToken: string,
      refreshTokenExpirationTime: number = Date.now() + 60 * 60 * 24 * 1000,
    ) => {
      setCookie("accessToken", accessToken, {
        path: "/",
        expires: new Date(jwtDecode<AccessTokenType>(accessToken).exp * 1000),
      });
      setCookie("refreshToken", refreshToken, {
        path: "/",
        expires: new Date(refreshTokenExpirationTime),
      });
    },
    [setCookie],
  );

  const logout = useCallback(() => {
    removeCookie("accessToken", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
    navigate("/login");
    toast(t("authProvider.logoutToast"));
    clearTimers();
  }, [clearTimers, navigate, removeCookie, t]);

  const isLoggedIn = useCallback(() => {
    if (cookies.refreshToken) {
      return true;
    }
    return false;
  }, [cookies.refreshToken]);

  const refreshMutation = useMutation({
    mutationFn: (refreshToken: string) => refreshAuthToken(refreshToken),
    onSuccess: (data) => {
      setCookiesForAuthToken(
        data.accessToken,
        data.refreshToken,
        data.refreshTokenExpirationTime * 1000,
      );
      setAutoRefresh(data.refreshToken);
    },
    onError: logout,
  });

  const setAutoRefresh = useCallback(
    (refreshToken: string) => {
      clearTimers();

      // calculate how long to update accessToken
      const timeUntilAccessTokenExpire = cookies.accessToken
        ? Math.min(
            jwtDecode<AccessTokenType>(cookies.accessToken).exp * 1000 -
              Date.now() -
              60 * 1000,
            2147483647,
          )
        : 0;

      // set a timer to update both token
      refreshTimer = window.setTimeout(async () => {
        if (!refreshMutation.isPending) {
          refreshMutation.mutate(refreshToken);
        }
      }, timeUntilAccessTokenExpire);
    },
    [clearTimers, cookies.accessToken, refreshMutation],
  );

  useEffect(() => {
    if (cookies.refreshToken) {
      setAutoRefresh(cookies.refreshToken);
    }
    return () => clearTimers();
  }, [cookies.refreshToken, setAutoRefresh, clearTimers]);

  return (
    <authContext.Provider
      value={{ login, setCookiesForAuthToken, logout, isLoggedIn }}
    >
      {children}
    </authContext.Provider>
  );
};
