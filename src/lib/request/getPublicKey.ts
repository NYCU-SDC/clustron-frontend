import { getAccessTokenFromCookies } from "@/lib/getAccessTokenFromCookies";

export async function getPublicKey(): Promise<
  {
    id: string;
    title: string;
    publicKey: string;
  }[]
> {
  const token = getAccessTokenFromCookies();
  if (!token) {
    console.error("No token but no logout");
    throw new Error();
  }

  const res = await fetch(`/api/publickey`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("Failed to get public key");
    throw new Error();
  }

  const data = await res.json();
  return data;
}
