import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getServers, serverQueryKeys } from "@/lib/request/resources";
import ResourceCountsBar from "@/components/resource/ResourceCountsBar";
import ResourceTable from "@/components/resource/ResourceTable";
import AddResourceSheet from "@/components/resource/AddResourceSheet";

export default function ResourceListPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useQuery({
    queryKey: serverQueryKeys.all,
    queryFn: getServers,
  });
  const servers = data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-8 md:px-6 md:py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("resourcePages.resourceList.title")}
        </h1>
        <AddResourceSheet />
      </div>

      <div className="flex flex-col items-center gap-6">
        <ResourceCountsBar servers={servers} />
        <ResourceTable
          servers={servers}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
}
