import { jwtDecode } from "jwt-decode";

type JWTPayload = {
  username: string;
  role?: string;
  exp: number;
};

export async function FetchAuthToken(email: string): Promise<string | null> {
  try {
    const res = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) return null;

    const data = await res.json();

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data.accessToken;
  } catch (err) {
    console.error("Network or unexpected error:", err);
    return null;
  }
}

export function getTokenExpiration(token: string): number | null {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.exp;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.error("No refresh token available");
      return null;
    }

    const res = await fetch("http://localhost:3001/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      console.error("Failed to refresh access token");
      return null;
    }
    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return null;
  }
}

let refreshTimer: number | undefined;

export function setupAutoRefresh(token: string) {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  const exp = getTokenExpiration(token);
  if (!exp) return;

  const expMs = exp * 1000;
  const now = Date.now();
  const delay = expMs - now - 60 * 1000;

  if (delay <= 0) {
    console.warn("Token already expired or too close to expiry");
    return;
  }

  refreshTimer = window.setTimeout(async () => {
    console.log("Token is about to expire, refreshing...");
    const newToken = await refreshAccessToken();
    if (newToken) {
      setupAutoRefresh(newToken);
    }
  }, delay);

  console.log(
    `Auto refresh scheduled in ${(delay / 1000 / 60).toFixed(2)} minutes`,
  );
}
