import { api } from "@/lib/request/api";

export async function saveOnboardingInfo(payload: {
  username: string;
  linuxUsername: string;
}): Promise<void> {
  return api("/api/onboarding", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
