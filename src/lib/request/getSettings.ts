import { getAccessTokenFromCookies } from "@/lib/getAccessTokenFromCookies";

export async function getSettings(): Promise<{
  username: string;
  linuxUsername: string;
} | null> {
  const token = getAccessTokenFromCookies();
  if (!token) return null;

  const res = await fetch(`/api/settings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("Failed to get name");
    return null;
  }

  const data = await res.json();
  return {
    username: data.username,
    linuxUsername: data.linuxUsername,
  };
}
