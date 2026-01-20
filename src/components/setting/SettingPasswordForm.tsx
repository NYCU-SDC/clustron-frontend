import { useState } from "react";
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
import { PasswordInput } from "@/components/ui/password-input";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/lib/request/updatePassword";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { z } from "zod";

export default function SettingPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { t } = useTranslation();

  const passwordSchema = z
    .string()
    .min(8)
    .regex(/[A-Za-z]/)
    .regex(/[0-9]/);

  const addMutation = useMutation({
    mutationFn: (password: string) => updatePassword(password),
    onSuccess: () => {
      setNewPassword("");
      setConfirmPassword("");
      toast.success(t("settingPasswordForm.successToast"));
    },
    onError: () => {
      toast.error(t("settingPasswordForm.failToast"));
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("settingPasswordForm.cardTitle")}
          </CardTitle>
          <CardDescription>
            {t("settingPasswordForm.cardDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <PasswordInput
                id="newPassword"
                placeholder={t("settingPasswordForm.newPassword")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                {t("onboardingForm.passwordFormatError")}
              </p>
            </div>
            <div className="grid gap-2">
              <PasswordInput
                id="confirmPassword"
                placeholder={t("settingPasswordForm.confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <TooltipProvider>
                {addMutation.isPending ? (
                  <Button className="px-7 py-5 w-44 cursor-pointer" disabled>
                    <Loader2Icon className="animate-spin" />
                    {t("settingPasswordForm.loadingBtn")}
                  </Button>
                ) : newPassword && confirmPassword ? (
                  <Button
                    className="px-7 py-5 w-44 cursor-pointer"
                    onClick={() => {
                      if (!passwordSchema.safeParse(newPassword).success) {
                        toast.error(t("onboardingForm.passwordFormatError"));
                        return;
                      }
                      if (newPassword !== confirmPassword) {
                        toast.error(t("onboardingForm.passwordMismatchError"));
                        return;
                      }
                      addMutation.mutate(newPassword);
                    }}
                  >
                    {t("settingPasswordForm.saveBtn")}
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        disabled
                        className="px-7 py-5 w-44 disabled:cursor-not-allowed disabled:pointer-events-auto"
                      >
                        {t("settingPasswordForm.saveBtn")}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      {t("settingPasswordForm.saveBtnToolTip")}
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
