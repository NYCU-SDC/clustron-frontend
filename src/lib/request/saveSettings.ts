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

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/api/settings`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    if (res.status === 400) {
      const err = new Error();
      err.name = "Bad Request";
      throw err;
    }
    console.error("Failed to save name");
    throw new Error();
  }
}
