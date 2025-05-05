import { useEffect, useCallback, ReactNode } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { accessTokenType } from "@/types/type";
import { refreshAuthToken } from "@/lib/request/refreshAuthToken";
import { authContext } from "@/lib/auth/authContext";

let accessTimer: number;
let refreshTimer: number;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "accessToken",
    "refreshTokenExpirationTime",
    "refreshToken",
  ]);

  const accessToken = cookies.accessToken || null;
  const refreshToken = cookies.refreshToken || null;

  const clearTimers = useCallback(() => {
    clearTimeout(accessTimer);
    clearTimeout(refreshTimer);
  }, []);

  const login = useCallback(() => {
    const callbackUrl = `${window.location.protocol}//${window.location.host}/callback`;
    const redirectUrl = `${window.location.protocol}//${window.location.host}/`;
    window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/api/oauth2/google?c=${callbackUrl}&r=${redirectUrl}`;
  }, []);

  const logout = useCallback(() => {
    removeCookie("accessToken", { path: "/" });
    removeCookie("refreshTokenExpirationTime", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
    clearTimers();
  }, [removeCookie, clearTimers]);

  const setAutoRefresh = useCallback(
    (accessToken: string, refreshToken: string) => {
      clearTimers();

      // get accessToken Expiration time
      const accessExpirationTime =
        jwtDecode<accessTokenType>(accessToken).exp * 1000;

      // calculate how long to update accessToken
      const timeUntilAccessExpiration = Math.min(
        accessExpirationTime - Date.now() - 890 * 1000,
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
          setAutoRefresh(data.accessToken, data.refreshToken);
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
          setAutoRefresh(data.accessToken, data.refreshToken);
        })();
      }

      // calculate how long does refreshToken expired
      const refreshExpirationTime = cookies.refreshTokenExpirationTime;
      if (refreshExpirationTime) {
        const timeUntilRefreshExpiration = Math.min(
          refreshExpirationTime * 1000 - Date.now(),
          2147483647,
        );
        if (timeUntilRefreshExpiration > 0) {
          refreshTimer = window.setTimeout(() => {
            logout();
          }, timeUntilRefreshExpiration);
        } else {
          logout();
        }
      }
    },
    [logout, setCookie, clearTimers],
  );

  useEffect(() => {
    if (accessToken && refreshToken) {
      setAutoRefresh(accessToken, refreshToken);
    }
    return () => clearTimers();
  }, [accessToken, refreshToken, setAutoRefresh, clearTimers]);

  return (
    <authContext.Provider value={{ login, logout }}>
      {children}
    </authContext.Provider>
  );
};
