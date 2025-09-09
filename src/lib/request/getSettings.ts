import { api } from "@/lib/request/api";
import type { Settings, BoundLoginMethods } from "@/types/settings";

export async function getSettings(): Promise<Settings & BoundLoginMethods> {
  return api("/api/settings");
}
