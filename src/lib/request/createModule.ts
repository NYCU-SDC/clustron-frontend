import { api } from "./api";
import { EnvironmentModule, EnvironmentVariable } from "./getModules";

export interface CreateModulePayload {
  title: string;
  environment: EnvironmentVariable[];
}

export async function createModule(
  payload: CreateModulePayload,
): Promise<EnvironmentModule> {
  return api<EnvironmentModule>("/api/modules", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
