import { api } from "@/lib/request/api";

type BoundLoginRespose = {
  url: string;
};

export async function createBindMethods(
  provider: "nycu" | "google",
): Promise<BoundLoginRespose> {
  const callbackUrl = `${window.location.protocol}//${window.location.host}/callback/bind`;
  const params = new URLSearchParams({ c: callbackUrl });
  return api(`/api/bind/oauth/${provider}?${params.toString()}`, {
    method: "POST",
  });
}
