import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings } from "@/lib/request/getSettings";
import { saveSettings } from "@/lib/request/saveSettings";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2Icon } from "lucide-react";

export default function SettingUsernameForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const [linuxUsername, setLinuxUsername] = useState("");
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const PROFILE_QUERY_KEY = ["username"];

  const {
    data = { username: "", linuxUsername: "" },
    isSuccess,
    isLoading,
    isError,
  } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getSettings,
  });

  const addMutation = useMutation({
    mutationFn: (payload: { username: string; linuxUsername: string }) =>
      saveSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success(t("settingUsernameForm.successToast"));
    },
    onError: () => {
      toast.error(t("settingUsernameForm.saveFailToast"));
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setUsername(data.username);
      setLinuxUsername(data.linuxUsername);
    }

    if (isError) {
      toast.error(t("settingUsernameForm.getFailToast"));
    }
  }, [isSuccess, isError, data, t]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("settingUsernameForm.cardTitleForUsername")}
          </CardTitle>
          <CardDescription>
            {t("settingUsernameForm.cardDescriptionForUsername")}
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
                placeholder={t(
                  "settingUsernameForm.placeHolderForInputUsername",
                )}
                value={linuxUsername}
                onChange={(e) => setLinuxUsername(e.target.value)}
              />
            )}
            <Separator></Separator>
            <div className="flex">
              {addMutation.isPending ? (
                <Button className="px-7 py-5 cursor-pointer" disabled>
                  <Loader2Icon className="animate-spin" />
                  {t("settingUsernameForm.loadingBtn")}
                </Button>
              ) : (
                <Button
                  className="px-7 py-5 cursor-pointer"
                  onClick={() => {
                    addMutation.mutate({ username, linuxUsername });
                  }}
                  disabled={isLoading}
                >
                  {t("settingUsernameForm.savaBtn")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
