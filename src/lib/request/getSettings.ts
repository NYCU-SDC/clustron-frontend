import { api } from "@/lib/request/api";
import type { fullSettings } from "@/types/settings";

export async function getSettings(): Promise<fullSettings> {
  return api("/api/settings");
}
