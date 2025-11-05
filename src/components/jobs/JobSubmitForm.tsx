import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PlusCircledIcon, MinusCircledIcon } from "@radix-ui/react-icons";
import { CircleCheckBig, ArrowRight } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createJob, getPartitions } from "@/lib/request/jobs";
import type { JobCreatePayload, Job } from "@/lib/request/jobs";

// ui components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

// Types
type EnvVar = { key: string; value: string };

function shellArg(s: string) {
  if (!s) return "";
  return `'${s.replace(/'/g, `'"'"'`)}'`;
}

export function buildSrunCommand(form: JobSubmitFormData) {
  const args: string[] = [];

  if (form.jobName) args.push(`-J ${shellArg(form.jobName)}`);
  if (form.comment) args.push(`--comment=${shellArg(form.comment)}`);
  if (form.cwd) args.push(`-D ${shellArg(form.cwd)}`);
  if (form.nodes) args.push(`-N ${form.nodes}`);
  if (form.cpus) args.push(`-c ${form.cpus}`);
  if (form.memPerCpu) args.push(`--mem-per-cpu=${form.memPerCpu}`);
  if (form.memPerNode) args.push(`--mem=${form.memPerNode}`);
  if (form.partition) args.push(`-p ${shellArg(form.partition)}`);
  if (form.timeLimit) args.push(`-t ${form.timeLimit}`);
  if (form.stdin) args.push(`-i ${shellArg(form.stdin)}`);
  if (form.stdout) args.push(`-o ${shellArg(form.stdout)}`);
  if (form.stderr) args.push(`-e ${shellArg(form.stderr)}`);

  const script = form.scriptPath ? shellArg(form.scriptPath) : "<script>";

  let result = "srun";
  const flags = args.join(" \\\n  ");
  if (flags) {
    result += ` ${flags} \\\n  ${script}`;
  } else {
    result += ` ${script}`;
  }

  return result;
}

interface JobSubmitFormData {
  jobName: string;
  comment: string;
  scriptPath: string;
  cwd: string;
  partition: string;
  tasks: number;
  cpus: number;
  memPerCpu: number;
  nodes: number;
  memPerNode: number;
  timeLimit: number;
  stdin: string;
  stdout: string;
  stderr: string;
  command: string;
}

type SubmitSuccessProps = {
  jobId: number | null;
  onReset: () => void;
};

function SubmitSuccess({ jobId, onReset }: SubmitSuccessProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* submit successfully */}
      <div className="rounded-md border-2 border-emerald-400 bg-white dark:bg-neutral-900 px-8 py-3">
        <div className="flex items-center justify-center gap-4">
          <CircleCheckBig
            className="h-12 w-12 text-emerald-500"
            strokeWidth={1}
          />
          <div className="leading-tight">
            <div className="font-semibold text-foreground text-xl tracking-tight">
              {t("jobSubmitForm.submitSuccessTitle", "Job Submit Successfully")}
            </div>
            <div className="font-semibold text-foreground text-lg leading-none">
              {t("jobSubmitForm.submitSuccessId", "ID #{{id}}", {
                id: jobId ?? "",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* button: submit another job */}
      <div className="mt-3 flex justify-end">
        <Button
          variant="outline"
          onClick={onReset}
          className="h-9 px-4 rounded-md text-sm"
        >
          {t("jobSubmitForm.submitAnother", "Submit Another Job")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function JobSubmitForm() {
  const { t } = useTranslation();

  const {
    data: partitions,
    isError: partErr,
    error: partError,
  } = useQuery({
    queryKey: ["partitions"],
    queryFn: getPartitions,
    retry: 1,
  });

  useEffect(() => {
    if (!partErr) return;
    const msg =
      (partError as any)?.detail ||
      (partError as Error)?.message ||
      t(
        "jobSubmitForm.sidebarList.partitionsLoadFail",
        "Failed to load partitions.",
      );
    toast.error(msg, { id: "partitions-load-error" });
  }, [partErr, partError, t]);

  const [successJobId, setSuccessJobId] = useState<number | null>(null);

  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: (job: Job) => setSuccessJobId(job.id),
    onError: (err: unknown) => {
      const msg =
        (err as any)?.detail ||
        (err as Error)?.message ||
        t("jobSubmitForm.sidebarList.submitFailToast", "Failed to submit job.");
      toast.error(msg, { id: "create-job-error" });
    },
  });

  const initialForm: JobSubmitFormData = {
    jobName: "",
    comment: "",
    scriptPath: "",
    cwd: "",
    partition: "",
    tasks: 1,
    cpus: 1,
    memPerCpu: 1000,
    nodes: 1,
    memPerNode: 1000,
    timeLimit: 1000,
    stdin: "",
    stdout: "",
    stderr: "",
    command: "",
  };

  const [formData, setFormData] = useState<JobSubmitFormData>(initialForm);

  const [envVars, setEnvVars] = useState<EnvVar[]>([{ key: "", value: "" }]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target;
    const fieldName = target.name as keyof JobSubmitFormData;
    const numberFields: (keyof JobSubmitFormData)[] = [
      "tasks",
      "cpus",
      "memPerCpu",
      "nodes",
      "memPerNode",
      "timeLimit",
    ];
    setFormData((prev) => {
      if (
        numberFields.includes(fieldName) &&
        (target as HTMLInputElement).type === "number"
      ) {
        const n = (target as HTMLInputElement).valueAsNumber;
        return {
          ...prev,
          [fieldName]: Number.isNaN(n) ? (NaN as unknown as number) : n,
        };
      }
      return {
        ...prev,
        [fieldName]: (target as HTMLInputElement | HTMLTextAreaElement).value,
      };
    });
  };

  const handleEnvChange = (
    index: number,
    field: keyof EnvVar,
    value: string,
  ) => {
    setEnvVars((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addEnvVar = () =>
    setEnvVars((prev) => [...prev, { key: "", value: "" }]);
  const removeEnvVar = (index: number) =>
    setEnvVars((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const environment = envVars
      .filter((ev) => ev.key.trim() !== "")
      .map((ev) => `${ev.key}=${ev.value ?? ""}`);

    const payload: JobCreatePayload = {
      name: formData.jobName,
      comment: formData.comment,
      current_working_directory: formData.cwd,
      script: formData.scriptPath,
      environment,
      partition: formData.partition,
      tasks: Number.isFinite(formData.tasks) ? formData.tasks : undefined,
      cpus_per_task: Number.isFinite(formData.cpus) ? formData.cpus : undefined,
      memory_per_cpu: Number.isFinite(formData.memPerCpu)
        ? formData.memPerCpu
        : undefined,
      nodes: Number.isFinite(formData.nodes)
        ? String(formData.nodes)
        : undefined,
      memory_per_node: Number.isFinite(formData.memPerNode)
        ? formData.memPerNode
        : undefined,
      time_limit: Number.isFinite(formData.timeLimit)
        ? formData.timeLimit
        : undefined,
      standard_input: formData.stdin || undefined,
      standard_output: formData.stdout || undefined,
      standard_error: formData.stderr || undefined,
    };

    createJobMutation.mutate(payload);
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEnvVars([{ key: "", value: "" }]);
    setSuccessJobId(null);
  };

  const commandPreview = useMemo(() => buildSrunCommand(formData), [formData]);

  if (successJobId !== null) {
    return <SubmitSuccess jobId={successJobId} onReset={resetForm} />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-screen bg-background">
      {/* Right: Main */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-3xl px-6 py-10 space-y-10">
          {/* Basic Job Information */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">
              {t("jobSubmitForm.basicInfoTitle")}
            </h2>

            <div className="grid gap-2">
              <Label htmlFor="jobName">
                {t("jobSubmitForm.jobNameLabel")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jobName"
                name="jobName"
                value={formData.jobName}
                onChange={handleChange}
                placeholder={t("jobSubmitForm.jobNamePlaceholder")}
                className="w-[70%]"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="comment">{t("jobSubmitForm.commentLabel")}</Label>
              <Textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                className="min-h-24"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="scriptPath">
                {t("jobSubmitForm.scriptPathLabel")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="scriptPath"
                name="scriptPath"
                value={formData.scriptPath}
                onChange={handleChange}
                placeholder={t("jobSubmitForm.scriptPathPlaceholder")}
                className="min-h-24"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cwd">{t("jobSubmitForm.cwdLabel")}</Label>
              <Textarea
                id="cwd"
                name="cwd"
                value={formData.cwd}
                onChange={handleChange}
                placeholder={t("jobSubmitForm.cwdPlaceholder")}
                className="min-h-24"
              />
            </div>
          </section>

          {/* Environment Setting */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">
              {t("jobSubmitForm.envSettingTitle")}
            </h2>

            <div className="grid grid-cols-3 gap-3 text-sm font-medium">
              <span>{t("jobSubmitForm.envVariable")}</span>
              <span>{t("jobSubmitForm.envValue")}</span>
              <span className="sr-only">actions</span>
            </div>

            <div className="space-y-3">
              {envVars.map((env, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-3 items-center"
                >
                  <Input
                    placeholder={t("jobSubmitForm.envVarPlaceholder")}
                    value={env.key}
                    onChange={(e) =>
                      handleEnvChange(index, "key", e.target.value)
                    }
                  />
                  <Input
                    placeholder={t("jobSubmitForm.envValPlaceholder")}
                    value={env.value}
                    onChange={(e) =>
                      handleEnvChange(index, "value", e.target.value)
                    }
                  />
                  <div className="flex items-center gap-2">
                    {index === envVars.length - 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-2"
                        onClick={addEnvVar}
                        aria-label="add env var"
                      >
                        <PlusCircledIcon className="h-5 w-5" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-2"
                        onClick={() => removeEnvVar(index)}
                        aria-label="remove env var"
                      >
                        <MinusCircledIcon className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Resources Setting */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">
              {t("jobSubmitForm.resourcesTitle")}
            </h2>

            <div className="grid gap-2">
              <Label>
                {t("jobSubmitForm.partitionLabel")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.partition}
                onValueChange={(v) =>
                  setFormData((p) => ({ ...p, partition: v }))
                }
              >
                <SelectTrigger className="w-[40%]">
                  <SelectValue
                    placeholder={t("jobSubmitForm.partitionPlaceholder")}
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

            <div className="grid gap-2">
              <Label htmlFor="tasks">
                {t("jobSubmitForm.tasksLabel")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tasks"
                name="tasks"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={formData.tasks}
                onChange={handleChange}
                className="w-[70%] [color-scheme:light] dark:[color-scheme:dark]"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cpus">
                {t("jobSubmitForm.cpusLabel")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cpus"
                name="cpus"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={formData.cpus}
                onChange={handleChange}
                className="w-[70%] [color-scheme:light] dark:[color-scheme:dark]"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="memPerCpu">
                {t("jobSubmitForm.memPerCpuLabel")}
              </Label>
              <Input
                id="memPerCpu"
                name="memPerCpu"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={formData.memPerCpu}
                onChange={handleChange}
                className="w-[70%] [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nodes">{t("jobSubmitForm.nodesLabel")}</Label>
              <Input
                id="nodes"
                name="nodes"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={formData.nodes}
                onChange={handleChange}
                className="w-[70%] [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="memPerNode">
                {t("jobSubmitForm.memPerNodeLabel")}
              </Label>
              <Input
                id="memPerNode"
                name="memPerNode"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={formData.memPerNode}
                onChange={handleChange}
                className="w-[70%] [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="timeLimit">
                {t("jobSubmitForm.timeLimitLabel")}
              </Label>
              <Input
                id="timeLimit"
                name="timeLimit"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={formData.timeLimit}
                onChange={handleChange}
                className="w-[70%] [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </section>

          {/* I/O Setting */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">
              {t("jobSubmitForm.ioSettingTitle")}
            </h2>

            <div className="grid gap-2">
              <Label htmlFor="stdin">{t("jobSubmitForm.stdinLabel")}</Label>
              <Input
                id="stdin"
                name="stdin"
                value={formData.stdin}
                onChange={handleChange}
                placeholder={t("jobSubmitForm.stdinPlaceholder")}
                className="w-[70%]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stdout">{t("jobSubmitForm.stdoutLabel")}</Label>
              <Input
                id="stdout"
                name="stdout"
                value={formData.stdout}
                onChange={handleChange}
                placeholder={t("jobSubmitForm.stdoutPlaceholder")}
                className="w-[70%]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stderr">{t("jobSubmitForm.stderrLabel")}</Label>
              <Input
                id="stderr"
                name="stderr"
                value={formData.stderr}
                onChange={handleChange}
                placeholder={t("jobSubmitForm.stderrPlaceholder")}
                className="w-[70%]"
              />
            </div>
          </section>

          {/* Command Preview / Submit */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">
              {t("jobSubmitForm.commandPreviewTitle")}
            </h2>

            <Textarea
              id="command"
              name="command"
              value={commandPreview}
              readOnly
              className="min-h-24 font-mono"
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="h-11 px-6"
                disabled={createJobMutation.isPending}
              >
                {createJobMutation.isPending
                  ? t("jobSubmitForm.sidebarList.submitting", "Submitting…")
                  : t("jobSubmitForm.submitButton")}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
