import { api } from "@/lib/request/api";
import type {
  AllowedLoginGroup,
  CreateResourceInput,
  Server,
  UpdateAllowedLoginGroupsPayload,
  UpdateServerRolePayload,
} from "@/types/resource";

export const serverQueryKeys = {
  all: ["servers"] as const,
  detail: (serverId: string) => ["servers", serverId] as const,
  allowedLoginGroups: ["servers", "allowedLoginGroups"] as const,
};

// GET /api/servers
export async function getServers(): Promise<Server[]> {
  return api("/api/servers");
}

// GET /api/servers/{server_id}
export async function getServerById(serverId: string): Promise<Server> {
  return api(`/api/servers/${serverId}`);
}

// POST /api/servers
export async function createServer(
  payload: CreateResourceInput,
): Promise<Server> {
  return api("/api/servers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// DELETE /api/servers/{server_id}
export async function deleteServer(serverId: string): Promise<void> {
  return api(`/api/servers/${serverId}`, { method: "DELETE" });
}

// POST /api/servers/{server_id}/reset
export async function resetServer(serverId: string): Promise<Server> {
  return api(`/api/servers/${serverId}/reset`, { method: "POST" });
}

// PATCH /api/servers/{server_id}/role
export async function updateServerRole(
  serverId: string,
  payload: UpdateServerRolePayload,
): Promise<Server> {
  return api(`/api/servers/${serverId}/role`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// GET /api/servers/allowedLoginGroups
export async function getAllowedLoginGroups(): Promise<AllowedLoginGroup[]> {
  return api("/api/servers/allowedLoginGroups");
}

// PUT /api/servers/allowedLoginGroups
export async function updateAllowedLoginGroups(
  payload: UpdateAllowedLoginGroupsPayload,
): Promise<void> {
  return api("/api/servers/allowedLoginGroups", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
