import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useGetGroups } from "@/hooks/useGetGroups";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import type { AllowedLoginGroupSelection, GroupType } from "@/types/resource";

type Props = {
  selectedGroups: AllowedLoginGroupSelection[];
  onChange: (groups: AllowedLoginGroupSelection[]) => void;
  disabled?: boolean;
};

export default function AllowedLoginGroupsField({
  selectedGroups,
  onChange,
  disabled,
}: Props) {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetGroups();
  const groups = data?.items ?? [];

  const isChecked = (groupId: string, groupType: GroupType) =>
    selectedGroups.some(
      (g) => g.groupId === groupId && g.groupType === groupType,
    );

  const toggle = (groupId: string, groupType: GroupType, checked: boolean) => {
    if (checked) {
      onChange([...selectedGroups, { groupId, groupType }]);
    } else {
      onChange(
        selectedGroups.filter(
          (g) => !(g.groupId === groupId && g.groupType === groupType),
        ),
      );
    }
  };

  return (
    <div className="grid gap-2">
      <Label>{t("resourceComponents.form.allowedLoginGroups")}</Label>
      <div className="rounded-md border">
        {isLoading ? (
          <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("common.loading")}
          </div>
        ) : isError ? (
          <p className="p-3 text-sm text-red-500">
            {t("resourceComponents.form.groupsLoadFail")}
          </p>
        ) : groups.length === 0 ? (
          <p className="p-3 text-sm text-muted-foreground">
            {t("resourceComponents.form.noGroups")}
          </p>
        ) : (
          groups.map((group, index) => (
            <div
              key={group.id}
              className={index !== groups.length - 1 ? "border-b" : ""}
            >
              <div className="bg-muted px-3 py-2 text-sm font-medium">
                {group.title}
              </div>
              <div className="flex flex-col gap-2 px-4 py-2">
                {(
                  [
                    ["BASE", "allMembers"],
                    ["ADMIN", "administratorsOnly"],
                  ] as const
                ).map(([groupType, labelKey]) => (
                  <label
                    key={groupType}
                    htmlFor={`allowed-login-group-${group.id}-${groupType}`}
                    className={`flex items-center gap-2 ${
                      disabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                  >
                    <Checkbox
                      id={`allowed-login-group-${group.id}-${groupType}`}
                      checked={isChecked(group.id, groupType)}
                      disabled={disabled}
                      onCheckedChange={(checked) =>
                        toggle(group.id, groupType, checked === true)
                      }
                    />
                    <span className="text-xs text-foreground">
                      {t(`resourceComponents.form.${labelKey}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
