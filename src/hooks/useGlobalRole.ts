// src/hooks/useGlobalRole.ts
import { jwtDecode } from "jwt-decode";
import type { AccessTokenType } from "@/types/type";
import { getAccessToken } from "@/lib/token";

export function useGlobalRole(): AccessTokenType["Role"] | null {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const payload = jwtDecode<AccessTokenType>(token);

    return payload.Role;
  } catch (e) {
    return null;
  }
}
