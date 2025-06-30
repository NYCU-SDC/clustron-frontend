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
import LangSwitcher from "@/components/LangSwitcher";

export default function SettingNameForm({
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
      toast.success(t("settingNameForm.successToast"));
    },
    onError: (error: Error) => {
      if (error.name === "Bad Request") {
        toast.error(t("settingNameForm.emptyErrorToast"));
      } else {
        toast.error(t("settingNameForm.saveFailToast"));
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setUsername(data.username);
      setLinuxUsername(data.linuxUsername);
    }
    if (isError) {
      toast.error(t("settingNameForm.getFailToast"));
    }
  }, [isSuccess, isError, data, t]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("settingNameForm.cardTitleForName")}
          </CardTitle>
          <CardDescription>
            {t("settingNameForm.cardDescriptionForName")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {isLoading ? (
              <Skeleton className="h-9 w-full border rounded-md " />
            ) : (
              <Input
                id="username"
                type="name"
                placeholder={t("settingNameForm.placeHolderForInputName")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            )}
            <Separator />
            <TooltipProvider>
              {addMutation.isPending ? (
                <Button className="px-7 py-5 w-24 cursor-pointer" disabled>
                  <Loader2Icon className="animate-spin" />
                  {t("settingNameForm.loadingBtn")}
                </Button>
              ) : username ? (
                <Button
                  className="px-7 py-5 w-24 cursor-pointer"
                  onClick={() => {
                    addMutation.mutate({ username, linuxUsername });
                  }}
                >
                  {t("settingNameForm.saveBtn")}
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled
                      className="px-7 py-5 w-24 disabled:cursor-not-allowed disabled:pointer-events-auto"
                    >
                      {t("settingNameForm.saveBtn")}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    {t("settingNameForm.saveBtnToolTip")}
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1.5">
              <CardTitle className="text-2xl">
                {t("settingNameForm.cardTitleForLanguage")}
              </CardTitle>
              <CardDescription>
                {t("settingNameForm.cardDescriptionForLanguage")}
              </CardDescription>
            </div>
            <LangSwitcher />
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
