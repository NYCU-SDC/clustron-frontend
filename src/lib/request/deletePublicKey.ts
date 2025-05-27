import { getAccessTokenFromCookies } from "@/lib/getAccessTokenFromCookies";

export async function deletePublicKey(id: string) {
  const token = getAccessTokenFromCookies();
  if (!token) {
    console.error("No token but no logout");
    throw new Error();
  }

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
    throw new Error();
  }
}
