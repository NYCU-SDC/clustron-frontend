import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/lib/request/getSettings";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingLinuxUsernameForm() {
  const [, setFullName] = useState("");
  const [linuxUsername, setLinuxUsername] = useState("");
  const { t } = useTranslation();
  const PROFILE_QUERY_KEY = ["username"];

  const {
    data = { fullName: "", linuxUsername: "" },
    isSuccess,
    isLoading,
    isError,
  } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getSettings,
  });

  useEffect(() => {
    if (isSuccess) {
      setFullName(data.fullName);
      setLinuxUsername(data.linuxUsername);
    }

    if (isError) {
      toast.error(t("settingLinuxUsernameForm.getFailToast"));
    }
  }, [isSuccess, isError, data, t]);

  return (
    <Card className="flex flex-col gap-6">
      <CardHeader>
        <CardTitle className="text-2xl">
          {t("settingLinuxUsernameForm.cardTitleForLinuxUsername")}
        </CardTitle>
        <CardDescription>
          {t("settingLinuxUsernameForm.cardDescriptionForLinuxUsername")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {isLoading ? (
            <Skeleton className="h-9 w-full border rounded-md " />
          ) : (
            <Input
              id="linuxUsername"
              type="name"
              placeholder="alice"
              value={linuxUsername}
              disabled
              onChange={(e) => setLinuxUsername(e.target.value)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
