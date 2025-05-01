import { useEffect, useCallback, ReactNode } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { JWTPayload } from "@/types/type";
import { refreshAuthToken } from "@/lib/request/refreshAuthToken";
import { authContext } from "@/lib/auth/authContext";

let accessTimer: number;
let refreshTimer: number;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "accessToken",
    "refreshToken",
  ]);

  const accessToken = cookies.accessToken || null;
  const refreshToken = cookies.refreshToken || null;

  const getExpiraionTime = useCallback((token: string): number | null => {
    try {
      return jwtDecode<JWTPayload>(token).exp * 1000;
    } catch {
      return null;
    }
  }, []);

  const clearTimers = useCallback(() => {
    clearTimeout(accessTimer);
    clearTimeout(refreshTimer);
  }, []);

  const login = useCallback(() => {
    const callbackUrl = `${window.location.protocol}//${window.location.host}/callback`;
    const redirectUrl = `${window.location.href}`;
    console.log(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/oauth2/google?c=${callbackUrl}&r=${redirectUrl}`,
    );
    window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/api/oauth2/google?c=${callbackUrl}&r=${redirectUrl}`;
    console.log(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/oauth2/google?c=${callbackUrl}&r=${redirectUrl}`,
    );
  }, []);

  const logout = useCallback(() => {
    removeCookie("accessToken", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
    clearTimers();
  }, [removeCookie, clearTimers]);

  const setAutoRefresh = useCallback(
    (accessToken: string, refreshToken: string) => {
      clearTimers();

      const accessExpirationTime = getExpiraionTime(accessToken);
      if (accessExpirationTime) {
        const timeUntilAccessExpiration =
          accessExpirationTime - Date.now() - 890 * 1000; // 890 is for test and debug

        if (timeUntilAccessExpiration > 0) {
          accessTimer = window.setTimeout(async () => {
            const data = await refreshAuthToken(cookies["refreshToken"]);
            if (!data) {
              console.log("data is NULL");
              logout();
              return;
            }
            setCookie("accessToken", data.accessToken, { path: "/" });
            setCookie("refreshToken", data.refreshToken, { path: "/" });
            setAutoRefresh(data.accessToken, data.refreshToken);
          }, timeUntilAccessExpiration);
        }
      } else {
        // assume user haven't open the clustron website for a long time so timeUntilAccessExpiration < 0
        // it need to refreshed immediately
        (async () => {
          const data = await refreshAuthToken(cookies["refreshToken"]);
          if (!data) {
            logout();
            return;
          }
          setCookie("accessToken", data.accessToken, { path: "/" });
          setCookie("refreshToken", data.refreshToken, { path: "/" });
          setAutoRefresh(data.accessToken, data.refreshToken);
        })();
      }

      const refreshExpirationTime = getExpiraionTime(refreshToken);
      if (refreshExpirationTime) {
        const timeUntilRefreshExpiration = refreshExpirationTime - Date.now();
        if (timeUntilRefreshExpiration > 0) {
          refreshTimer = window.setTimeout(logout, timeUntilRefreshExpiration);
        } else {
          logout();
        }
      }
    },
    [getExpiraionTime, logout, setCookie, clearTimers],
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
