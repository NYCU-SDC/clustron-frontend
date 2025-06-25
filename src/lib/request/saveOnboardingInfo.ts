import { api } from "@/lib/request/api";
import type { Settings } from "@/types/type";

export async function saveOnboardingInfo(payload: Settings): Promise<void> {
  return api("/api/onboarding", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
