import { Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

type Props = {
  groupId: string;
  isArchived?: boolean;
};

export default function AddMemberButton({ groupId, isArchived }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isSettingsPage = location.pathname === `/groups/${groupId}/settings`;

  const handleClick = () => {
    if (isArchived) return;
    navigate(`/groups/${groupId}/add-member`);
  };

  if (!isSettingsPage) return null;
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
