import { getAccessTokenFromCookies } from "@/lib/getAccessTokenFromCookies";

export async function getPublicKey(): Promise<
  | {
      id: string;
      title: string;
      publicKey: string;
    }[]
  | null
> {
  const token = getAccessTokenFromCookies();
  if (!token) return null;

  const res = await fetch(`/api/publickey`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("Failed to get public key");
    return null;
  }

  const data = await res.json();
  return data;
}
