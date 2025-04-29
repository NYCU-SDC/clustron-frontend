export async function FetchAuthToken(
  email: string,
): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const res = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return { accessToken: data.accessToken, refreshToken: data.refreshToken };
  } catch (err) {
    console.error("Network or unexpected error:", err);
    return null;
  }
}
