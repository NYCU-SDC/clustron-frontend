import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

type Props = {
  groupId: string;
  isArchived?: boolean;
  display?: boolean;
};

export default function AddMemberButton({
  groupId,
  isArchived,
  display = true,
}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    if (isArchived) return;
    navigate(`/groups/${groupId}/add-member`);
  };

  if (!display) return null;

  return (
    <Button
      onClick={handleClick}
      disabled={isArchived}
      variant="default"
      className="flex items-right gap-1"
    >
      <Plus className="w-4 h-4" />
      {t("groupComponents.addMemberButton.newMembers")}
    </Button>
  );
}
