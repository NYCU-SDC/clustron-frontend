import { getAccessTokenFromCookies } from "@/lib/getAccessTokenFromCookies";

export async function saveSettings(payload: {
  username: string;
  linuxUsername: string;
}) {
  const token = getAccessTokenFromCookies();
  if (!token) {
    console.error("No token but no logout");
    throw new Error();
  }

  const res = await fetch(`/api/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("Failed to save name");
    throw new Error();
  }
}
