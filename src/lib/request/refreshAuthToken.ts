export async function refreshAuthToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  refreshTokenExpirationTime: number;
}> {
  if (!refreshToken) {
    console.error("Failed to refresh auth token due to no refreshtoken");
    throw new Error();
  }

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/api/refreshToken/${refreshToken}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    console.error("Failed to refresh auth token due to response error");
    throw new Error();
  }

  const data = await res.json();
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    refreshTokenExpirationTime: data.expirationTime,
  };
}
