import { useEffect, useCallback, ReactNode } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { JWTPayload } from "@/types/type";
import { FetchAuthToken } from "@/lib/request/fetchAuthToken";
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
          accessExpirationTime - Date.now() - 60 * 1000;
        if (timeUntilAccessExpiration > 0) {
          accessTimer = window.setTimeout(async () => {
            const data = await refreshAuthToken();
            if (!data) {
              logout();
              return;
            }
            setCookie("accessToken", data.accessToken, { path: "/" });
            setCookie("refreshToken", data.refreshToken, { path: "/" });
            setAutoRefresh(data.accessToken, data.refreshToken);
          }, timeUntilAccessExpiration);
        }
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

  const login = useCallback(
    async (email: string): Promise<boolean> => {
      logout();
      const data = await FetchAuthToken(email);
      if (!data) return false;
      setCookie("accessToken", data.accessToken, { path: "/" });
      setCookie("refreshToken", data.refreshToken, { path: "/" });
      setAutoRefresh(data.accessToken, data.refreshToken);
      return true;
    },
    [logout, setCookie, setAutoRefresh],
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
