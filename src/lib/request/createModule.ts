import { api } from "./api";
import { EnvironmentModule, EnvironmentVariable } from "./getModules";

export interface CreateModuleRequest {
  title: string;
  environment: EnvironmentVariable[];
}

export async function createModule(
  payload: CreateModuleRequest,
): Promise<EnvironmentModule> {
  return api<EnvironmentModule>("/api/modules", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
