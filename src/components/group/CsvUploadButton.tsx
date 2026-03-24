import { useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { GroupMemberRoleName, GroupRole } from "@/types/group";

type Props = {
  assignableRoles: GroupRole[];
  onAddBatch: (
    newMembers: { id: string; roleName: GroupMemberRoleName }[],
  ) => void;
  disabled?: boolean;
};

export default function CsvUploadButton({
  assignableRoles,
  onAddBatch,
  disabled = false,
}: Props) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolveRole = (rawRole: string): GroupMemberRoleName => {
    const normalized = rawRole.trim().toLowerCase();

    const exact = assignableRoles.find(
      (r) => r.roleName.toLowerCase() === normalized,
    );
    if (exact) return exact.roleName;

    const student = assignableRoles.find(
      (r) => r.roleName.toLowerCase() === "student",
    );
    if (student) return student.roleName;

    return assignableRoles[0]?.roleName ?? "student";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      const members: { id: string; roleName: GroupMemberRoleName }[] = [];

      for (const line of lines) {
        const firstComma = line.indexOf(",");
        const id =
          firstComma === -1 ? line.trim() : line.slice(0, firstComma).trim();
        const roleRaw =
          firstComma === -1 ? "" : line.slice(firstComma + 1).trim();

        if (!id) continue;
        members.push({ id, roleName: resolveRole(roleRaw) });
      }

      if (members.length === 0) return;

      onAddBatch(members);
      toast.success(
        t("groupComponents.csvUpload.loadedToast", { count: members.length }),
      );
    };

    reader.readAsText(file);

    // Reset so same file can be re-uploaded
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileChange}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} className="mr-2" />
            {t("groupComponents.csvUpload.uploadButton")}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs text-xs whitespace-pre-line"
        >
          {t("groupComponents.csvUpload.tooltipFormat")}
        </TooltipContent>
      </Tooltip>
    </>
  );
}
