import { getAccessTokenFromCookies } from "@/lib/getAccessTokenFromCookies";

export async function getSettings(): Promise<{
  username: string;
  linuxUsername: string;
}> {
  const token = getAccessTokenFromCookies();
  if (!token) {
    console.error("No token but no logout");
    throw new Error();
  }
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/api/settings`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    console.error("Failed to get name");
    throw new Error();
  }

  const data = await res.json();
  return data;
}
