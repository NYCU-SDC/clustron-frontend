import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getPartitions } from "@/lib/request/jobs";
import { useTranslation } from "react-i18next";
import {
  RESOURCE_ROLE_OPTIONS,
  type AnsibleRole,
  type ResourceFormData,
} from "@/types/resource";

type AddressMode = "ip_address" | "ssh_config_host";

type Props = {
  formData: ResourceFormData;
  onChange: (formData: ResourceFormData) => void;
  disabled?: boolean;
};

export default function ResourceFormFields({
  formData,
  onChange,
  disabled = false,
}: Props) {
  const { t } = useTranslation();

  const [addressMode, setAddressMode] = useState<AddressMode>(
    formData.ssh_config_host ? "ssh_config_host" : "ip_address",
  );

  const { data: partitions } = useQuery({
    queryKey: ["partitions"],
    queryFn: getPartitions,
  });

  const setField = <K extends keyof ResourceFormData>(
    field: K,
    value: ResourceFormData[K],
  ) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 border-b pb-6">
        <div className="grid gap-1">
          <h3 className="text-lg font-semibold">
            {t("resourceComponents.form.machineDetailsTitle")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("resourceComponents.form.machineDetailsDescription")}
          </p>
        </div>

        <Tabs
          value={addressMode}
          onValueChange={(value) => {
            const mode = value as AddressMode;
            setAddressMode(mode);
            const otherField =
              mode === "ip_address" ? "ssh_config_host" : "ip_address";
            setField(otherField, "");
          }}
        >
          <TabsList>
            <TabsTrigger value="ip_address" disabled={disabled}>
              {t("resourceComponents.form.ipAddress")}
            </TabsTrigger>
            <TabsTrigger value="ssh_config_host" disabled={disabled}>
              {t("resourceComponents.form.sshConfigHost")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ip_address" className="grid gap-2">
            <Input
              id="ip_address"
              value={formData.ip_address}
              onChange={(e) => setField("ip_address", e.target.value)}
              placeholder="192.168.1.100"
              disabled={disabled}
            />
            <p className="text-sm text-muted-foreground">
              {t("resourceComponents.form.ipAddressHint")}
            </p>
          </TabsContent>

          <TabsContent value="ssh_config_host" className="grid gap-2">
            <Input
              id="ssh_config_host"
              value={formData.ssh_config_host}
              onChange={(e) => setField("ssh_config_host", e.target.value)}
              placeholder="my-cluster-node-1"
              disabled={disabled}
            />
            <p className="text-sm text-muted-foreground">
              {t("resourceComponents.form.sshConfigHostHint")}
            </p>
          </TabsContent>
        </Tabs>

        <div className="grid gap-2">
          <Label htmlFor="private_ip">
            {t("resourceComponents.form.privateIp")}
          </Label>
          <Input
            id="private_ip"
            value={formData.private_ip}
            onChange={(e) => setField("private_ip", e.target.value)}
            placeholder="10.0.0.5"
            disabled={disabled}
          />
          <p className="text-sm text-muted-foreground">
            {t("resourceComponents.form.privateIpHint")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cpu_cores">
              {t("resourceComponents.form.cpuCores")}
            </Label>
            <Input
              id="cpu_cores"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={formData.cpu_cores}
              onChange={(e) => setField("cpu_cores", e.target.value)}
              placeholder="32"
              disabled={disabled}
              className="[color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="memory_mb">
              {t("resourceComponents.form.memoryMb")}
            </Label>
            <Input
              id="memory_mb"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={formData.memory_mb}
              onChange={(e) => setField("memory_mb", e.target.value)}
              placeholder="131072"
              disabled={disabled}
              className="[color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="ssh_user">
              {t("resourceComponents.form.sshUser")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ssh_user"
              value={formData.ssh_user}
              onChange={(e) => setField("ssh_user", e.target.value)}
              placeholder="ubuntu"
              disabled={disabled}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ssh_key_name">
              {t("resourceComponents.form.sshKeyName")}
            </Label>
            <Input
              id="ssh_key_name"
              value={formData.ssh_key_name}
              onChange={(e) => setField("ssh_key_name", e.target.value)}
              placeholder="cluster-key"
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-1">
          <h3 className="text-lg font-semibold">
            {t("resourceComponents.form.clusterConfigTitle")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("resourceComponents.form.clusterConfigDescription")}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="ansible_name">
            {t("resourceComponents.form.name")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ansible_name"
            value={formData.ansible_name}
            onChange={(e) => setField("ansible_name", e.target.value)}
            placeholder="node-01"
            disabled={disabled}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>
              {t("resourceComponents.form.role")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.ansible_role}
              onValueChange={(v) => setField("ansible_role", v as AnsibleRole)}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("resourceComponents.form.selectPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_ROLE_OPTIONS.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {t(role.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>{t("resourceComponents.form.slurmPartition")}</Label>
            <Select
              value={formData.slurm_partition}
              onValueChange={(v) => setField("slurm_partition", v)}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("resourceComponents.form.selectPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {(partitions?.partitions ?? []).map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Alert className="border-amber-500">
        <AlertDescription className="gap-4">
          <p className="text-foreground">
            {t("resourceComponents.form.prepareMachineIntro")}
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>{t("resourceComponents.form.prepareMachineStep1")}</li>
            <li>{t("resourceComponents.form.prepareMachineStep2")}</li>
            <li>
              {t("resourceComponents.form.prepareMachineStep3")}
              <pre className="mt-1 whitespace-pre-wrap rounded bg-muted px-2 py-1 text-xs">
                {"{ssh_user} ALL=(ALL) NOPASSWD:ALL"}
              </pre>
            </li>
          </ol>
          <p>{t("resourceComponents.form.prepareMachineFootnote")}</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
