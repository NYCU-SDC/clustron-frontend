import { api } from "./api";

export interface EnvironmentVariable {
  key: string;
  value: string;
}

export interface CreateModulePayload {
  title: string;
  environment: EnvironmentVariable[];
}

export interface ModuleData {
  id: string;
  title: string;
  environment: EnvironmentVariable[];
}

export async function getModules(): Promise<ModuleData[]> {
  return api<ModuleData[]>("/api/modules", { method: "GET" });
}
