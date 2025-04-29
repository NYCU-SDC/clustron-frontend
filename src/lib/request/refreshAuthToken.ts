export async function refreshAuthToken(): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> {
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
      console.error("Failed to update token");
      return null;
    }
    const data = await res.json();
    return { accessToken: data.accessToken, refreshToken: data.refreshToken };
  } catch (err) {
    console.error("Error refreshing token:", err);
    return null;
  }
}
