import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { ModuleCard } from "@/components/EnvironmentModule/ModuleCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

import { getModules } from "@/lib/request/getModules";
import { createModule } from "@/lib/request/createModule";
import { updateModule } from "@/lib/request/updateModule";
import { deleteModule } from "@/lib/request/deleteModule";

import type { CreateModulePayload } from "@/lib/request/createModule";

export default function EnvironmentModulePage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: modulesData = [], isLoading } = useQuery({
    queryKey: ["modules"],
    queryFn: getModules,
  });

  const createMutation = useMutation({
    mutationFn: createModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
    onError: (error) => {
      console.error("User canceled operation or an error occurred:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CreateModulePayload;
    }) => updateModule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
  });

  const handleCreateNew = () => {
    createMutation.mutate({
      title: "New Module",
      environment: [{ key: "EXAMPLE_VAR", value: "example_value" }],
    });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl px-6 py-20 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl px-6 py-10">
      <div className="mb-6">
        <Button
          onClick={handleCreateNew}
          disabled={createMutation.isPending}
          className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900"
        >
          {createMutation.isPending ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-1 h-4 w-4" />
          )}
          {t("environmentModulePage.newModuleBtn")}
        </Button>
      </div>

      <div className="space-y-4">
        {modulesData.map((mod) => (
          <ModuleCard
            key={mod.id}
            module={mod}
            onUpdate={async (updatedModule) => {
              updateMutation.mutate({
                id: updatedModule.id,
                payload: {
                  title: updatedModule.title,
                  environment: updatedModule.environment,
                },
              });
            }}
            onDelete={async (id) => {
              deleteMutation.mutate(id);
            }}
          />
        ))}

        {modulesData.length === 0 && (
          <div className="text-center py-16 text-sm text-muted-foreground border-2 border-dashed border-border/60 rounded-xl bg-muted/10">
            {t("environmentModulePage.emptyStatePrefix")}
            <strong className="text-foreground">
              {t("environmentModulePage.emptyStateHighlight")}
            </strong>
            {t("environmentModulePage.emptyStateSuffix")}
          </div>
        )}
      </div>
    </div>
  );
}
