import { api } from "@/lib/request/api";
import type {
  AllowedLoginGroup,
  CreateResourceRequest,
  Server,
  UpdateAllowedLoginGroupsRequest,
  UpdateServerRoleRequest,
} from "@/types/resource";

export const serverQueryKeys = {
  all: ["servers"] as const,
  detail: (serverId: string) => ["servers", serverId] as const,
  allowedLoginGroups: (serverId: string) =>
    ["servers", serverId, "allowedLoginGroups"] as const,
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
  payload: CreateResourceRequest,
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

// POST /api/servers/setup
export async function setupAllServers(): Promise<void> {
  return api("/api/servers/setup", { method: "POST" });
}

// POST /api/servers/{server_id}/reset
export async function resetServer(serverId: string): Promise<Server> {
  return api(`/api/servers/${serverId}/reset`, { method: "POST" });
}

// PATCH /api/servers/{server_id}/role
export async function updateServerRole(
  serverId: string,
  payload: UpdateServerRoleRequest,
): Promise<Server> {
  return api(`/api/servers/${serverId}/role`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// GET /api/servers/{server_id}/allowedLoginGroups
export async function getAllowedLoginGroups(
  serverId: string,
): Promise<AllowedLoginGroup[]> {
  return api(`/api/servers/${serverId}/allowedLoginGroups`);
}

// PUT /api/servers/{server_id}/allowedLoginGroups
export async function updateAllowedLoginGroups(
  serverId: string,
  payload: UpdateAllowedLoginGroupsRequest,
): Promise<void> {
  return api(`/api/servers/${serverId}/allowedLoginGroups`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
