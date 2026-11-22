import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  AlertTriangle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";
import type { HealthCheckResponse } from "@/types/resource";

type StageState = "pass" | "fail" | "warn" | "pending";

type Row = { labelKey: ParseKeys; state: StageState };

function deriveRows(r: HealthCheckResponse): Row[] {
  const hostKeyState: StageState =
    r.host_key_status === "ok" || r.host_key_status === "skipped"
      ? "pass"
      : r.host_key_status === "new" || r.host_key_status === "changed"
        ? "warn"
        : "pending";

  return [
    {
      labelKey: "resourceComponents.healthCheck.stageReachable",
      state: r.reachable
        ? "pass"
        : r.stage === "reachable"
          ? "fail"
          : r.host_key_status === "skipped"
            ? "pending"
            : "fail",
    },
    {
      labelKey: "resourceComponents.healthCheck.stageHostKey",
      state: hostKeyState,
    },
    {
      labelKey: "resourceComponents.healthCheck.stageLogin",
      state: r.login_ok ? "pass" : r.stage === "login" ? "fail" : "pending",
    },
    {
      labelKey: "resourceComponents.healthCheck.stageAnsiblePing",
      state: r.ansible_ping_ok
        ? "pass"
        : r.stage === "ansible_ping"
          ? "fail"
          : "pending",
    },
  ];
}

function StateIcon({ state }: { state: StageState }) {
  switch (state) {
    case "pass":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case "fail":
      return <XCircle className="h-4 w-4 text-rose-600" />;
    case "warn":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    default:
      return <MinusCircle className="h-4 w-4 text-muted-foreground" />;
  }
}

export default function HealthCheckResultPanel({
  result,
}: {
  result: HealthCheckResponse;
}) {
  const { t } = useTranslation();
  const rows = deriveRows(result);

  const borderClass = result.ok
    ? "border-emerald-500"
    : result.host_key_status === "new" || result.host_key_status === "changed"
      ? "border-amber-500"
      : "border-rose-500";

  return (
    <div className={`grid gap-3 rounded-md border px-4 py-3 ${borderClass}`}>
      <p className="text-sm font-semibold">
        {t("resourceComponents.healthCheck.resultTitle")}
      </p>
      <ul className="grid gap-2">
        {rows.map((row) => (
          <li
            key={row.labelKey}
            className="flex items-center gap-2 text-sm text-foreground"
          >
            <StateIcon state={row.state} />
            {t(row.labelKey)}
          </li>
        ))}
      </ul>
      {result.detail ? (
        <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
          {result.detail}
        </pre>
      ) : null}
    </div>
  );
}
