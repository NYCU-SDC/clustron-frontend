import { api } from "./api";
import type { CreateModulePayload, ModuleData } from "./getModules";

export async function createModule(
  payload: CreateModulePayload,
): Promise<ModuleData> {
  return api<ModuleData>("/api/modules", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
