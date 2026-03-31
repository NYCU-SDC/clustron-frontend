import { api } from "./api";

export interface EnvironmentVariable {
  key: string;
  value: string;
}

export interface CreateModulePayload {
  title: string;
  environment: EnvironmentVariable[];
}

export interface EnvironmentModule {
  id: string;
  title: string;
  environment: EnvironmentVariable[];
}

export async function getModules(): Promise<EnvironmentModule[]> {
  return api<EnvironmentModule[]>("/api/modules", { method: "GET" });
}
