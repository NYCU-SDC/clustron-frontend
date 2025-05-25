import { getToken } from "@/lib/token";
import type { GlobalRole } from "@/lib/permission";

export function useGlobalRole(): GlobalRole | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.Role as GlobalRole;
  } catch {
    return null;
  }
}
