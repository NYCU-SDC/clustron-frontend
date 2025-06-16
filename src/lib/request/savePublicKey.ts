import { api } from "@/lib/request/api";

export async function savePublicKey(payload: {
  title: string;
  publicKey: string;
}): Promise<void> {
  return api("/api/publickey", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
