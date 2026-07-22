import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createServer, serverQueryKeys } from "@/lib/request/resources";
import { getErrMessage } from "@/lib/errors";
import ResourceFormFields from "@/components/resource/ResourceFormFields";
import type { CreateResourceInput, ResourceFormData } from "@/types/resource";

const emptyResourceFormData: ResourceFormData = {
  ansible_name: "",
  ip_address: "",
  ssh_config_host: "",
  private_ip: "",
  ssh_user: "",
  ssh_key_name: "",
  ansible_role: "",
  slurm_partition: "",
  cpu_cores: "",
  memory_mb: "",
};

export default function AddResourceSheet() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ResourceFormData>(
    emptyResourceFormData,
  );

  const toastId = "create-server";
  const { mutate: submitCreateServer, isPending } = useMutation({
    mutationFn: createServer,
    onMutate: () => {
      toast.loading(
        t("resourceComponents.createServer.creatingToast", "Adding node..."),
        { id: toastId },
      );
    },
    onSuccess: () => {
      toast.success(
        t(
          "resourceComponents.createServer.createSuccessToast",
          "Node added successfully",
        ),
        { id: toastId },
      );
      queryClient.invalidateQueries({ queryKey: serverQueryKeys.all });
      setOpen(false);
      setFormData(emptyResourceFormData);
    },
    onError: (err) => {
      const msg = getErrMessage(
        err,
        t(
          "resourceComponents.createServer.createFailToast",
          "Failed to add node",
        ),
      );
      toast.error(msg, { id: toastId });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateResourceInput = {
      ansible_name: formData.ansible_name,
      ssh_user: formData.ssh_user,
      ansible_role:
        formData.ansible_role as CreateResourceInput["ansible_role"],
      ip_address: formData.ip_address || undefined,
      ssh_config_host: formData.ssh_config_host || undefined,
      private_ip: formData.private_ip || undefined,
      ssh_key_name: formData.ssh_key_name || undefined,
      slurm_partition: formData.slurm_partition || undefined,
      cpu_cores: formData.cpu_cores ? Number(formData.cpu_cores) : undefined,
      memory_mb: formData.memory_mb ? Number(formData.memory_mb) : undefined,
    };

    submitCreateServer(payload);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setFormData(emptyResourceFormData);
      }}
    >
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          {t("resourceComponents.addResourceSheet.trigger")}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle className="text-2xl">
              {t("resourceComponents.addResourceSheet.title")}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 px-4">
            <ResourceFormFields
              formData={formData}
              onChange={setFormData}
              disabled={isPending}
            />
          </div>

          <SheetFooter className="flex-row justify-end">
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                {t("common.cancel")}
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isPending}>
              {t("resourceComponents.addResourceSheet.submit")}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
