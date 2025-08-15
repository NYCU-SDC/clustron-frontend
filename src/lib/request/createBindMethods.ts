import { api } from "@/lib/request/api";

export async function createBindMethods(
  provider: "nycu" | "google",
): Promise<void> {
  const callbackUrl = `${window.location.protocol}//${window.location.host}/callback`;
  const redirectUrl = `${window.location.protocol}//${window.location.host}/`;
  const params = new URLSearchParams({ c: callbackUrl, r: redirectUrl });
  console.log(`/api/bind/oauth/${provider}?${params.toString()}`);
  return api(`/api/bind/oauth/${provider}?${params.toString()}`, {
    method: "POST",
  });
}
