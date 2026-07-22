import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useGetGroups } from "@/hooks/useGetGroups";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

type Props = {
  selectedGroupIds: string[];
  onChange: (groupIds: string[]) => void;
};

export default function AllowedLoginGroupsField({
  selectedGroupIds,
  onChange,
}: Props) {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetGroups();
  const groups = data?.items ?? [];

  const toggleGroup = (groupId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedGroupIds, groupId]);
    } else {
      onChange(selectedGroupIds.filter((id) => id !== groupId));
    }
  };

  return (
    <div className="grid gap-2">
      <Label>{t("resourceComponents.form.allowedLoginGroups")}</Label>
      <div className="rounded-md border">
        {isLoading ? (
          <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("loading")}
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
            <label
              key={group.id}
              htmlFor={`allowed-login-group-${group.id}`}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
                index !== groups.length - 1 ? "border-b" : ""
              }`}
            >
              <Checkbox
                id={`allowed-login-group-${group.id}`}
                checked={selectedGroupIds.includes(group.id)}
                onCheckedChange={(checked) =>
                  toggleGroup(group.id, checked === true)
                }
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{group.title}</span>
                <span className="text-xs text-muted-foreground">
                  {group.ldapGroupName}
                </span>
              </div>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
