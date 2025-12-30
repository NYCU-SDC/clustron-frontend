import { api } from "@/lib/request/api";

type BoundLoginMethodsRespose = {
  url: string;
};

export async function bindLoginMethods(
  provider: "nycu" | "google" | "github",
): Promise<BoundLoginMethodsRespose> {
  const callbackUrl = `${window.location.protocol}//${window.location.host}/callback/bind`;
  const params = new URLSearchParams({ c: callbackUrl });
  return api(`/api/bind/oauth/${provider}?${params.toString()}`, {
    method: "POST",
  });
}
