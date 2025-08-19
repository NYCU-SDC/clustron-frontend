import { api } from "@/lib/request/api";
import { BindLoginRespose } from "@/types/settings";

export async function createBindMethods(
  provider: "NYCU" | "GOOGLE",
): Promise<BindLoginRespose> {
  const callbackUrl = `${window.location.protocol}//${window.location.host}/callback/bind`;
  // const redirectUrl = `${window.location.protocol}//${window.location.host}/`;
  const params = new URLSearchParams({ c: callbackUrl });
  // console.log(`/api/bind/oauth/${provider}?${params.toString()}`);
  return api(`/api/bind/oauth/${provider}?${params.toString()}`, {
    method: "POST",
  });
}
