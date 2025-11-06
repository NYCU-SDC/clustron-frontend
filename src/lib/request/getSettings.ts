import { api } from "@/lib/request/api";
import type { Settings } from "@/types/settings";

export async function getSettings(): Promise<
  Settings & {
    boundLoginMethods: {
      provider: "google" | "nycu";
      email: string;
    }[];
  }
> {
  return api("/api/settings");
}
