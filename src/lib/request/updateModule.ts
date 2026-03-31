import { api } from "./api";
import type { EnvironmentModule } from "./getModules";
import type { CreateModulePayload } from "./createModule";

export async function updateModule(
  id: string,
  payload: CreateModulePayload,
): Promise<EnvironmentModule> {
  return api<EnvironmentModule>(`/api/modules/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
