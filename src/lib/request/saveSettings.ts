import { api } from "@/lib/request/api";
import type { Settings } from "@/types/settings";

export async function saveSettings(payload: Settings): Promise<void> {
  return api("/api/settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
