import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { VariableRow } from "./VariableRow";

import type {
  EnvironmentModule,
  EnvironmentVariable,
} from "@/lib/request/getModules";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Pencil, Trash2, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ModuleCardProps {
  module: EnvironmentModule;
  onUpdate: (module: EnvironmentModule) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ModuleCard({ module, onUpdate, onDelete }: ModuleCardProps) {
  const { t } = useTranslation();

  const [isExpanded, setIsExpanded] = useState(false);
  const [editedTitle, setEditedTitle] = useState(module.title);
  const [editedEnv, setEditedEnv] = useState<EnvironmentVariable[]>(
    module.environment,
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isExpanded) {
      setIsEditingTitle(false);
      setEditedTitle(module.title);
      setEditedEnv(module.environment);
    }
  }, [isExpanded, module.title, module.environment]);

  const handleEnvChange = (
    index: number,
    field: keyof EnvironmentVariable,
    value: string,
  ) => {
    setEditedEnv((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };
  const addEnvVar = () =>
    setEditedEnv((prev) => [...prev, { key: "", value: "" }]);
  const removeEnvVar = (index: number) =>
    setEditedEnv((prev) => prev.filter((_, i) => i !== index));

  const handleCancel = () => {
    setEditedTitle(module.title);
    setEditedEnv(module.environment);
    setIsEditingTitle(false);
  };

  const handleSave = async () => {
    if (!editedTitle.trim()) return;
    const cleanEnv = editedEnv.filter((ev) => ev.key.trim() !== "");

    setIsSaving(true);

    try {
      await onUpdate({
        id: module.id,
        title: editedTitle,
        environment: cleanEnv,
      });

      toast.success(t("moduleCard.saveSuccessToast"));

      setIsEditingTitle(false);
    } catch (error) {
      toast.error(t("moduleCard.saveFailToast"));
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border border-border rounded-lg bg-card text-card-foreground shadow-sm mb-4 overflow-hidden">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={isExpanded ? "module-content" : ""}
        onValueChange={(v) => setIsExpanded(v === "module-content")}
      >
        <AccordionItem value="module-content" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-4 px-5 [&>svg]:hidden flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <ChevronRight
                className={cn(
                  "h-5 w-5 shrink-0 text-muted-foreground/80 transition-transform duration-200",
                  isExpanded ? "rotate-90" : "",
                )}
              />

              {isEditingTitle ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="h-8 px-2.5 py-1 w-[240px] font-medium"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              ) : (
                <span className="text-lg font-semibold truncate text-foreground">
                  {editedTitle}
                </span>
              )}

              {isExpanded && !isEditingTitle && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground/80 hover:text-foreground hover:bg-muted/60 flex-shrink-0 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingTitle(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit Title</span>
                </Button>
              )}
            </div>

            {isExpanded && !isEditingTitle && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete Module</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive">
                      {t("moduleCard.deleteConfirmTitle")}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-foreground">
                      {t("moduleCard.deleteConfirmDescription", {
                        title: module.title,
                      })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {t("moduleCard.cancelBtn")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-white hover:bg-destructive/90"
                      onClick={() => onDelete(module.id)}
                    >
                      {t("moduleCard.deleteBtn")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </AccordionTrigger>

          <AccordionContent className="px-5 pb-5">
            <div className="space-y-3.5 pt-1 mt-0">
              <div className="grid grid-cols-3 gap-3 text-sm font-medium text-foreground pt-1">
                <span>{t("moduleCard.variableLabel")}</span>
                <span>{t("moduleCard.valueLabel")}</span>
                <span className="sr-only">actions</span>
              </div>

              <div className="space-y-3">
                {editedEnv.map((env, index) => (
                  <VariableRow
                    key={index}
                    variableKey={env.key}
                    variableValue={env.value}
                    isLastRow={index === editedEnv.length - 1}
                    onKeyChange={(newKey) =>
                      handleEnvChange(index, "key", newKey)
                    }
                    onValueChange={(newValue) =>
                      handleEnvChange(index, "value", newValue)
                    }
                    onAdd={addEnvVar}
                    onRemove={() => removeEnvVar(index)}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 mt-0">
                <Button
                  variant="outline"
                  className="px-5 h-9"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  {t("moduleCard.cancelBtn")}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 h-9 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900"
                >
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("moduleCard.saveBtn")}
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
