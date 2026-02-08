import { api } from "@/lib/request/api";
import type { PasswordSettings } from "@/types/settings";

export async function saveOnboardingInfo(
  payload: PasswordSettings,
): Promise<void> {
  return api("/api/onboarding", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
