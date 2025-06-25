import { api } from "@/lib/request/api";
import { Settings } from "@/types/type";

export async function saveSettings(payload: Settings): Promise<void> {
  return api("/api/settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
