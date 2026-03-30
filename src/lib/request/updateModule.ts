import { api } from "./api";
import type { CreateModulePayload, ModuleData } from "./getModules";

export async function updateModule(
  id: string,
  payload: CreateModulePayload,
): Promise<ModuleData> {
  return api<ModuleData>(`/api/modules/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
