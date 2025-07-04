import { api } from "@/lib/request/api";
import { PublicKey } from "@/types/type";

export async function getPublicKey(length?: number): Promise<PublicKey[]> {
  return api(length ? `/api/publickey?length=${length}` : "/api/publickey}");
}
