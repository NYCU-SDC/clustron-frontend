import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import type { AccessToken } from "@/types/type";

export function useJwtPayload(): AccessToken | null {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;

  if (!token) return null;
  try {
    return jwtDecode<AccessToken>(token);
  } catch {
    return null;
  }
}
