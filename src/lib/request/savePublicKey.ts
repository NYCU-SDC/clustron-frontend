import { getAccessTokenFromCookies } from "@/lib/getAccessTokenFromCookies";

export async function savePublicKey(payload: {
  title: string;
  publicKey: string;
}): Promise<{
  id: string;
  title: string;
  publicKey: string;
} | null> {
  const token = getAccessTokenFromCookies();
  if (!token) return null;

  const res = await fetch(`/api/publickey`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("Failed to save public key");
    return null;
  }

  const data = await res.json();
  return {
    id: data.id,
    title: data.title,
    publicKey: data.publicKey,
  };
}
