import { api } from "@/lib/request/api";
import { AuthCookie } from "@/types/type";

export async function refreshAuthToken(
  refreshToken: string,
): Promise<AuthCookie> {
  if (!refreshToken) {
    console.error("Failed to refresh auth token due to no refreshtoken");
    throw new Error();
  }
  return api(`/api/refreshToken/${refreshToken}`);
}
