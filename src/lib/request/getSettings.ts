import { api } from "@/lib/request/api";
import { Settings } from "@/types/type";

export async function getSettings(): Promise<Settings> {
  return api("/api/settings");
}
