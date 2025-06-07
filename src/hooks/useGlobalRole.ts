// src/hooks/useGlobalRole.ts
import { jwtDecode } from "jwt-decode";
import type { AccessToken } from "@/types/type";
import { getAccessToken } from "@/lib/token";

export function useGlobalRole(): AccessToken["Role"] | null {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const payload = jwtDecode<AccessToken>(token);

    return payload.Role;
  } catch (e) {
    console.error("Failed to decode access token:", e);
    return null;
  }
}
