import { getAccessTokenFromCookies } from "@/lib/getAccessTokenFromCookies";

export async function deletePublicKey(id: string): Promise<string | null> {
  const token = getAccessTokenFromCookies();
  if (!token) return null;

  const res = await fetch(`/api/publickey`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    console.error("Failed to delete public key");
  }

  const data = await res.text();
  return data;
}
