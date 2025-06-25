import { api } from "@/lib/request/api";
import type { PublicKeyInfo } from "@/types/type";

export async function getPublicKey(length?: number): Promise<PublicKeyInfo[]> {
  return api(length ? `/api/publickey?length=${length}` : "/api/publickey}");
}
