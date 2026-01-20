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
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { saveOnboardingInfo } from "@/lib/request/saveOnboardingInfo";
import { authContext } from "@/lib/auth/authContext";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { z } from "zod";
import type { Settings } from "@/types/settings";

export default function OnboardingForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [fullName, setFullName] = useState("");
  const [linuxUsername, setLinuxUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { refreshMutation } = useContext(authContext);
  const { t } = useTranslation();

  const linuxUsernameSchema = z
    .string()
    .min(1)
    .regex(/^[a-z_][a-z0-9_-]*\$?$/);

  const passwordSchema = z
    .string()
    .min(8)
    .regex(/[A-Za-z]/)
    .regex(/[0-9]/);

  const addMutation = useMutation({
    mutationFn: async (payload: Settings) => {
      console.log("Onboarding Payload:", payload);
      await saveOnboardingInfo(payload);
      await refreshMutation.mutateAsync();
    },
    onSuccess: () => {
      navigate("/");
      toast.success(t("onboardingForm.successToast"));
    },
    onError: (err: Error) => {
      if (err.name === "400") {
        // Error message from the receveid response
        // invalid username: Linux username already exists
        if (err.message.includes("exists")) {
          toast.error(t("onboardingForm.usernameExistsErrorToast"));
        }
        // invalid username: Linux username contain reserved keywords
        else if (err.message.includes("reserved")) {
          toast.error(t("onboardingForm.reservedKeywordErrorToast"));
        }
        // invalid username: Linux username must start with a lowercase letter or underscore,
        // followed by lowercase letters, numbers, underscores, or hyphens, and can end with a dollar sign
        else if (err.message.includes("start")) {
          toast.error(t("onboardingForm.formatErrorToast"));
        }
        // other uncaught message
        else {
          toast.error(t("onboardingForm.saveFailToast"));
        }
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
            {/* Full Name */}
            <div className="grid gap-2">
              <Label className="ml-2 font-medium">
                {t("onboardingForm.labelForInputFullName")}
                <span className="text-red-400">*</span>
              </Label>
              <Input
                className="mx-2 w-auto placeholder:text-muted-foreground/70"
                id="fullname"
                type="name"
                placeholder={t("onboardingForm.placeHolderForInputFullName")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            {/* Linux Username */}
            <div className="grid gap-2">
              <Label className="ml-2 font-medium">
                {t("onboardingForm.labelForInputLinuxUsername")}
                <span className="text-red-400">*</span>
              </Label>
              <Input
                className="mx-2 w-auto placeholder:text-muted-foreground/70"
                id="linuxUsername"
                type="name"
                placeholder="alice"
                value={linuxUsername}
                onChange={(e) => setLinuxUsername(e.target.value)}
              />
              <p className="ml-2 text-sm text-destructive">
                {t("onboardingForm.warningTextForLinuxUsername")}
              </p>
            </div>
            {/* Linux Password */}
            <div className="grid gap-2 px-2">
              <Label className="font-medium">
                {t("onboardingForm.labelForInputPassword")}
                <span className="text-red-400">*</span>
              </Label>
              <PasswordInput
                className="placeholder:text-muted-foreground/70"
                id="password"
                placeholder={t("onboardingForm.placeHolderForInputPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                {t("onboardingForm.passwordFormatError")}
              </p>
              <p className="text-sm text-destructive">
                {t("onboardingForm.passwordNote")}
              </p>
            </div>
            {/* Confirm Password */}
            <div className="grid gap-2 px-2">
              <Label className="font-medium">
                {t("onboardingForm.labelForInputConfirmPassword")}
                <span className="text-red-400">*</span>
              </Label>
              <PasswordInput
                className="placeholder:text-muted-foreground/70"
                id="confirmPassword"
                placeholder={t(
                  "onboardingForm.placeHolderForInputConfirmPassword",
                )}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <TooltipProvider>
              <div className="flex justify-end">
                {addMutation.isPending ? (
                  <Button className="px-7 py-5 w-28 cursor-pointer" disabled>
                    <Loader2Icon className="animate-spin" />
                    {t("onboardingForm.loadingBtn")}
                  </Button>
                ) : fullName && linuxUsername && password && confirmPassword ? (
                  <Button
                    className="px-7 py-5 w-16 cursor-pointer"
                    onClick={() => {
                      if (
                        !linuxUsernameSchema.safeParse(linuxUsername).success
                      ) {
                        toast.error(t("onboardingForm.formatErrorToast"));
                        return;
                      }
                      if (!passwordSchema.safeParse(password).success) {
                        toast.error(t("onboardingForm.passwordFormatError"));
                        return;
                      }
                      if (password !== confirmPassword) {
                        toast.error(t("onboardingForm.passwordMismatchError"));
                        return;
                      }
                      addMutation.mutate({
                        fullName,
                        linuxUsername,
                        password,
                      });
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
