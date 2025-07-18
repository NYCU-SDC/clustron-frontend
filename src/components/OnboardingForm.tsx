import { useState, useContext } from "react";
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
import { saveOnboardingInfo } from "@/lib/request/saveOnboardingInfo";
import { authContext } from "@/lib/auth/authContext";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { z } from "zod";
import type { Settings } from "@/types/type";

export default function OnboardingForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [fullName, setFullName] = useState("");
  const [linuxUsername, setLinuxUsername] = useState("");
  const navigate = useNavigate();
  const { refreshMutation } = useContext(authContext);
  const { t } = useTranslation();

  const linuxUsernameSchema = z
    .string()
    .min(1)
    .regex(/^[a-z_][a-z0-9_-]*\$?$/);

  const addMutation = useMutation({
    mutationFn: async (payload: Settings) => {
      await saveOnboardingInfo(payload);
      await refreshMutation.mutateAsync();
    },
    onSuccess: () => {
      navigate("/");
      toast.success(t("onboardingForm.successToast"));
    },
    onError: (err: Error) => {
      if (err.name === "400") {
        toast.error(t("onboardingForm.formatErrorToast"));
      } else {
        toast.error(t("onboardingForm.saveFailToast"));
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle className="mx-auto text-2xl">
            {t("onboardingForm.cardTitleForName")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label className="ml-2 font-medium">
                {t("onboardingForm.labelForInputFullName")}
                <span className="text-red-400">*</span>
              </Label>
              <Input
                className="mx-2 w-auto"
                id="fullname"
                type="name"
                placeholder={t("onboardingForm.placeHolderForInputFullName")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label className="ml-2 font-medium">
                {t("onboardingForm.labelForInputLinuxUsername")}
                <span className="text-red-400">*</span>
              </Label>
              <Input
                className="mx-2 w-auto"
                id="linuxUsername"
                type="name"
                placeholder="alice"
                value={linuxUsername}
                onChange={(e) => setLinuxUsername(e.target.value)}
              />
            </div>
            <TooltipProvider>
              <div className="flex justify-end">
                {addMutation.isPending ? (
                  <Button className="px-7 py-5 w-28 cursor-pointer" disabled>
                    <Loader2Icon className="animate-spin" />
                    {t("onboardingForm.loadingBtn")}
                  </Button>
                ) : fullName && linuxUsername ? (
                  <Button
                    className="px-7 py-5 w-16 cursor-pointer"
                    onClick={() => {
                      if (
                        !linuxUsernameSchema.safeParse(linuxUsername).success
                      ) {
                        toast.error(t("onboardingForm.formatErrorToast"));
                        return;
                      }
                      addMutation.mutate({ fullName, linuxUsername });
                    }}
                  >
                    {t("onboardingForm.saveBtn")}
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        disabled
                        className="px-7 py-5 w-16 disabled:cursor-not-allowed disabled:pointer-events-auto"
                      >
                        {t("onboardingForm.saveBtn")}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      {t("onboardingForm.saveBtnToolTip")}
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
