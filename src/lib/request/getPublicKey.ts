import { getAccessTokenFromCookies } from "@/lib/getAccessTokenFromCookies";
import { PublicKey } from "@/types/type";

export async function getPublicKey(length?: number): Promise<PublicKey[]> {
  const token = getAccessTokenFromCookies();
  if (!token) {
    console.error("No token but no logout");
    throw new Error();
  }

  const res = await fetch(
    length ? `/api/publickey?length=${length}` : `/api/publickey`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    console.error("Failed to get public key");
    throw new Error();
  }

  const data = await res.json();
  return data;
}
