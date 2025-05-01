export async function refreshAuthToken(refreshToken?: string): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> {
  if (!refreshToken) {
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
    return null;
  }
  const data = await res.json();
  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
}
