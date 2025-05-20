import { getAccessTokenFromCookies } from "@/lib/getAccessTokenFromCookies";

export async function saveSettings(
  username: string,
  linuxUsername: string,
): Promise<{ username: string; linuxUsername: string } | null> {
  const token = getAccessTokenFromCookies();
  if (!token) return null;

  const res = await fetch(`/api/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, linuxUsername }),
  });

  if (!res.ok) {
    console.error("failed to save name");
    return null;
  }

  const data = await res.json();
  return {
    username: data.username,
    linuxUsername: data.linuxUsername,
  };
}
