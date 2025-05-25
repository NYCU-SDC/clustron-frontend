export async function refreshAuthToken(refreshToken: string): Promise<{
  accessToken: string;
  expirationTime: number;
  refreshToken: string;
} | null> {
  if (!refreshToken) {
    return null;
  }

  const res = await fetch(`/api/refreshToken/${refreshToken}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  return {
    accessToken: data.accessToken,
    expirationTime: data.expirationTime,
    refreshToken: data.refreshToken,
  };
}
