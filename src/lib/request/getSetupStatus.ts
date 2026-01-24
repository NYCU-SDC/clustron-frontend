import { api } from "@/lib/request/api";

export type SetupStatusResponse = {
  progress: Record<string, boolean>;
};

type RawSetupStatusResponse =
  | { progress: Record<string, boolean> }
  | Record<string, boolean>;

export async function getSetupStatus(): Promise<SetupStatusResponse> {
  const data = await api<RawSetupStatusResponse>("/api/setup/status");

  const progress =
    typeof data === "object" && data !== null && "progress" in data
      ? (data as { progress: Record<string, boolean> }).progress
      : (data as Record<string, boolean>);

  return { progress };
}

export function isSetupComplete(progress: Record<string, boolean>) {
  return Object.values(progress).every(Boolean);
}
