import { getToken } from "@/lib/token";
import type { GlobalRole } from "@/lib/permission";

export function useJwtPayload(): { username: string; role: GlobalRole } | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      username: payload.Username ?? "(未知)",
      role: payload.Role as GlobalRole,
    };
  } catch {
    return null;
  }
}
