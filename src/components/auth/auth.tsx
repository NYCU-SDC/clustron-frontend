export async function handleLogin(email: string): Promise<string | null> {
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
    localStorage.setItem("token", data.token);
    return data.token;
  } catch (err) {
    console.error("Network or unexpected error:", err);
    return null;
  }
}
