import { Cookies } from "react-cookie";

export function getAccessTokenFromCookies(): string | null {
  return new Cookies().get("accessToken") || null;
}
