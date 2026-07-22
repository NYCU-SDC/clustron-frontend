export type AnsibleRole = "head_nodes" | "compute_nodes";

export type ServerStatus = "unset" | "provisioning" | "active" | "failed";

// GET /api/servers item shape
export type Server = {
  id: string;
  ansible_name: string;
  ip_address?: string;
  ssh_config_host?: string;
  private_ip?: string;
  ssh_user: string;
  ssh_key_name?: string;
  ansible_role: AnsibleRole;
  slurm_partition?: string;
  status: ServerStatus;
  provision_detail?: string;
  cpu_cores?: number;
  memory_mb?: number;
};

// shape of GET /api/servers/allowedLoginGroups item
export type AllowedLoginGroup = {
  groupId: string;
  title: string;
  ldapCn: string;
};

// body of POST /api/servers
export type CreateResourceInput = {
  ansible_name: string;
  ip_address?: string;
  ssh_config_host?: string;
  private_ip?: string;
  ssh_user: string;
  ssh_key_name?: string;
  ansible_role: AnsibleRole;
  slurm_partition?: string;
  cpu_cores?: number;
  memory_mb?: number;
};

// body of PATCH /api/servers/{server_id}/role
export type UpdateServerRolePayload = {
  ansible_role: AnsibleRole;
};

// body of PUT /api/servers/allowedLoginGroups
export type UpdateAllowedLoginGroupsPayload = {
  groupIds: string[];
};

// state shape of the Add/Edit resource form
export type ResourceFormData = {
  ansible_name: string;
  ip_address: string;
  ssh_config_host: string;
  private_ip: string;
  ssh_user: string;
  ssh_key_name: string;
  ansible_role: AnsibleRole | "";
  slurm_partition: string;
  cpu_cores: string;
  memory_mb: string;
};

export const RESOURCE_ROLE_OPTIONS: { value: AnsibleRole; labelKey: string }[] =
  [
    { value: "head_nodes", labelKey: "resourceComponents.form.roleHeadNode" },
    {
      value: "compute_nodes",
      labelKey: "resourceComponents.form.roleComputeNode",
    },
  ];

export const RESOURCE_ROLE_LABEL_KEYS: Record<AnsibleRole, string> =
  Object.fromEntries(
    RESOURCE_ROLE_OPTIONS.map((option) => [option.value, option.labelKey]),
  ) as Record<AnsibleRole, string>;
