import { api } from "./api";
import type { CreateModulePayload, EnvironmentModule } from "./getModules";

export async function createModule(
  payload: CreateModulePayload,
): Promise<EnvironmentModule> {
  return api<EnvironmentModule>("/api/modules", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
