import { api } from "./api";

export async function deleteModule(id: string): Promise<void> {
  return api(`/api/modules/${id}`, { method: "DELETE" });
}
