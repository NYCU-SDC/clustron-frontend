import { getAccessTokenFromCookies } from "../getAccessTokenFromCookies";

export async function saveOnboarding(username: string) {
  try {
    const token = getAccessTokenFromCookies();
    if (!token) {
      console.error("No token but no logout");
      throw new Error("No access token in cookies");
    }

    const res = await fetch(`/api/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });

    if (!res.ok) {
      console.error("Failed to save onboarding information due to HTTP Error");
      throw new Error("HTTP Error");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Failed to save onboarding information due to Catch Error:",
        error.message,
      );
    }
    throw error;
  }
}
