import { api } from "./api";
import type { EnvironmentModule } from "./getModules";
import type { CreateModuleRequest } from "./createModule";

export async function updateModule(
  id: string,
  payload: CreateModuleRequest,
): Promise<EnvironmentModule> {
  return api<EnvironmentModule>(`/api/modules/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
