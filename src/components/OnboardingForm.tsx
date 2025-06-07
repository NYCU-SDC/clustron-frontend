import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { saveOnboarding } from "@/lib/request/saveOnboarding";
import { useContext } from "react";
import { authContext } from "@/lib/auth/authContext";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

export default function OnboardingForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { refreshAction } = useContext(authContext);
  const { t } = useTranslation();

  const addMutation = useMutation({
    mutationFn: (username: string) => saveOnboarding(username),
    onSuccess: () => {
      refreshAction();
      navigate("/");
      toast.success(t("settingNameForm.successToast"));
    },
    onError: () => {
      toast.error(t("settingNameForm.saveFailToast"));
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle className="mx-auto text-2xl">
            Enter Your Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label className="ml-2 font-medium">
                Full Name<span className="text-red-400">*</span>
              </Label>
              <Input
                className="mx-2 w-auto"
                id="username"
                type="name"
                placeholder="John Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <TooltipProvider>
              <div className="flex justify-end">
                {addMutation.isPending ? (
                  <Button className="px-7 py-5 w-28 cursor-pointer" disabled>
                    <Loader2Icon className="animate-spin" />
                    {t("settingNameForm.loadingBtn")}
                  </Button>
                ) : username ? (
                  <Button
                    className="px-7 py-5 w-16 cursor-pointer"
                    onClick={() => {
                      addMutation.mutate(username);
                    }}
                  >
                    {t("settingNameForm.savaBtn")}
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        disabled
                        className="px-7 py-5 w-16 disabled:cursor-not-allowed disabled:pointer-events-auto"
                      >
                        Save
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      {t("settingNameForm.saveBtnToolTip")}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
