import StateCard from "@/components/jobs/StateCard";
import { useTranslation } from "react-i18next";
import type { Server } from "@/types/resource";

export default function ResourceCountsBar({ servers }: { servers: Server[] }) {
  const { t } = useTranslation();

  const counts = servers.reduce(
    (acc, server) => {
      acc[server.status] += 1;
      return acc;
    },
    { active: 0, provisioning: 0, failed: 0, unset: 0 },
  );

  return (
    <div className="flex flex-wrap gap-4">
      <StateCard
        value={counts.active}
        label={t("resourceComponents.status.active")}
      />
      <StateCard
        value={counts.provisioning}
        label={t("resourceComponents.status.provisioning")}
      />
      <StateCard
        value={counts.failed}
        label={t("resourceComponents.status.failed")}
      />
      <StateCard
        value={counts.unset}
        label={t("resourceComponents.status.unset")}
      />
    </div>
  );
}
