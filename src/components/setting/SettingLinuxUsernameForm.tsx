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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings } from "@/lib/request/getSettings";
import { saveSettings } from "@/lib/request/saveSettings";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2Icon } from "lucide-react";
import type { Settings } from "@/types/type";

export default function SettingLinuxUsernameForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const [linuxUsername, setLinuxUsername] = useState("");
  const { t } = useTranslation();
  const queryClient = useQueryClient();
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

  const addMutation = useMutation({
    mutationFn: (payload: Settings) => saveSettings(payload),
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
      setUsername(data.fullName);
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
                placeholder="alice"
                value={linuxUsername}
                disabled // TODO: Enable this input when the backend is ready
                onChange={(e) => setLinuxUsername(e.target.value)}
              />
            )}
            <Separator />
            <TooltipProvider>
              {addMutation.isPending ? (
                <Button className="px-7 py-5 w-24 cursor-pointer" disabled>
                  <Loader2Icon className="animate-spin" />
                  {t("settingUsernameForm.loadingBtn")}
                </Button>
              ) : linuxUsername ? (
                <Button
                  disabled // TODO: Enable this button when the backend is ready
                  className="px-7 py-5 w-24 cursor-pointer"
                  onClick={() => {
                    addMutation.mutate({ fullName: username, linuxUsername });
                  }}
                >
                  {t("settingUsernameForm.savaBtn")}
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled
                      className="px-7 py-5 w-24 disabled:cursor-not-allowed disabled:pointer-events-auto"
                    >
                      {t("settingUsernameForm.savaBtn")}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    {t("settingUsernameForm.saveBtnToolTip")}
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
