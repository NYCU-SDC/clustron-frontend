import { api } from "./api";
import type { CreateModulePayload, EnvironmentModule } from "./getModules";

export async function updateModule(
  id: string,
  payload: CreateModulePayload,
): Promise<EnvironmentModule> {
  return api<EnvironmentModule>(`/api/modules/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
