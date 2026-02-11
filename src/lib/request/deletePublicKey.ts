import { api } from "@/lib/request/api";

export async function deletePublicKey(fingerprint: string): Promise<void> {
  return api(`/api/publickey`, {
    method: "DELETE",
    body: JSON.stringify({ fingerprint }),
  });
}
