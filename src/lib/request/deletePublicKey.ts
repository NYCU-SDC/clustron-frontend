import { api } from "@/lib/request/api";

export async function deletePublicKey(id: string): Promise<void> {
  return api("/api/publickey", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}
