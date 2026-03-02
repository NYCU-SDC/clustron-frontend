import { api } from "@/lib/request/api";

export type SetupStatusResponse = {
  progress: Record<string, boolean>;
};

export async function getSetupStatus(): Promise<SetupStatusResponse> {
  return api<SetupStatusResponse>("/api/setup/status");
}

export function isSetupComplete(progress: Record<string, boolean>) {
  return Object.values(progress).every(Boolean);
}
