import type { AnsibleService } from "@/types/resource";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useId } from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  value: AnsibleService[];
  onChange: (services: AnsibleService[]) => void;
  disabled?: boolean;
};

const ALL_SERVICES: AnsibleService[] = ["ldap", "slurm", "nfs"];

export default function ResourceServicesField({
  value,
  onChange,
  disabled = false,
}: Props) {
  const { t } = useTranslation();
  const serviceId = useId();
  const selectedAll = ALL_SERVICES.every((service) => value.includes(service));
  const hasSelected = ALL_SERVICES.some((service) => value.includes(service));
  const handleSelectedAllChange = () => {
    if (selectedAll) {
      onChange([]);
    } else {
      onChange([...ALL_SERVICES]);
    }
  };
  const ldapId = useId();
  const slurmId = useId();
  const nfsId = useId();
  const handleServiceChange = (service: AnsibleService, checked: boolean) => {
    if (checked) {
      onChange(value.includes(service) ? value : [...value, service]);
    } else {
      onChange(value.filter((item) => item !== service));
    }
  };

  let headerChecked: boolean | "indeterminate";
  if (selectedAll) {
    headerChecked = true;
  } else if (hasSelected) {
    headerChecked = "indeterminate";
  } else {
    headerChecked = false;
  }

  return (
    <div className="grid gap-2">
      <h3 className="text-sm font-medium">
        {t("resourceComponents.servicesField.title")}
      </h3>
      <div className="overflow-hidden rounded-md border divide-y">
        <div className="flex items-center gap-4 px-3 py-3">
          <Checkbox
            id={serviceId}
            checked={headerChecked}
            disabled={disabled}
            onCheckedChange={handleSelectedAllChange}
          />
          <Label htmlFor={serviceId} className="text-muted-foreground">
            {t("resourceComponents.servicesField.columnTitle")}
          </Label>
        </div>
        <div
          className={cn(
            "flex items-center gap-4 px-3 py-3",
            value.includes("ldap") && "bg-muted/50",
          )}
        >
          <Checkbox
            id={ldapId}
            checked={value.includes("ldap")}
            disabled={disabled}
            onCheckedChange={(nextCheck) =>
              handleServiceChange("ldap", nextCheck === true)
            }
          />
          <Label htmlFor={ldapId}>LDAP</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="ml-auto rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Info className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {t("resourceComponents.servicesField.descriptions.ldap")}
            </TooltipContent>
          </Tooltip>
        </div>
        <div
          className={cn(
            "flex items-center gap-4 px-3 py-3",
            value.includes("slurm") && "bg-muted/50",
          )}
        >
          <Checkbox
            id={slurmId}
            checked={value.includes("slurm")}
            disabled={disabled}
            onCheckedChange={(nextCheck) =>
              handleServiceChange("slurm", nextCheck === true)
            }
          />
          <Label htmlFor={slurmId}>Slurm</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="ml-auto rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Info className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {t("resourceComponents.servicesField.descriptions.slurm")}
            </TooltipContent>
          </Tooltip>
        </div>
        <div
          className={cn(
            "flex items-center gap-4 px-3 py-3",
            value.includes("nfs") && "bg-muted/50",
          )}
        >
          <Checkbox
            id={nfsId}
            checked={value.includes("nfs")}
            disabled={disabled}
            onCheckedChange={(nextCheck) =>
              handleServiceChange("nfs", nextCheck === true)
            }
          />
          <Label htmlFor={nfsId}>NFS</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="ml-auto rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Info className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {t("resourceComponents.servicesField.descriptions.nfs")}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
