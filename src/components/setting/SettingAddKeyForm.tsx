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
import { Input } from "@/components/ui/input";
import { Separator as CardSeperator } from "@radix-ui/react-dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { savePublicKey } from "@/lib/request/savePublicKey";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

export default function SettingAddKeyForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [title, setTitle] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const queryClient = useQueryClient();
  const PUBLIC_KEYS_QUERY_KEY = ["publicKeys"];
  const navigate = useNavigate();
  const { t } = useTranslation();

  const addMutation = useMutation({
    mutationFn: (payload: { title: string; publicKey: string }) =>
      savePublicKey(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLIC_KEYS_QUERY_KEY });
      toast.success(t("settingAddKeyForm.successToast"));
      navigate("/setting/ssh");
    },
    onError: (error: Error) => {
      if (error.name === "Bad Request") {
        toast.error(t("settingAddKeyForm.formatErrorToast"));
      } else {
        toast.error(t("settingAddKeyForm.saveFailToast"));
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="pt-10 px-2">
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("settingAddKeyForm.cardTitleForTitle")}
          </CardTitle>
          <CardDescription>
            {t("settingAddKeyForm.cardDescriptionForTitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder={t("settingAddKeyForm.placeHolderForInputTitle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </CardContent>
        <CardSeperator />
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("settingAddKeyForm.cardTitleForKey")}
          </CardTitle>
          <CardDescription>
            {t("settingAddKeyForm.cardDescriptionForKey")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <Textarea
              placeholder={t("settingAddKeyForm.placeHolderForInputKey")}
              onChange={(e) => setPublicKey(e.target.value)}
              className="h-32"
            />
            <Separator />
            <TooltipProvider>
              {!title || !publicKey ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled
                      className="px-7 py-5 w-32 disabled:cursor-not-allowed disabled:pointer-events-auto"
                    >
                      {t("settingAddKeyForm.saveBtn")}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    {t("settingAddKeyForm.saveBtnToolTip")}
                  </TooltipContent>
                </Tooltip>
              ) : addMutation.isPending ? (
                <Button
                  className="px-7 py-5 w-32 disabled:cursor-not-allowed disabled:pointer-events-auto"
                  disabled
                >
                  <Loader2Icon className="animate-spin" />
                  {t("settingAddKeyForm.loadingBtn")}
                </Button>
              ) : (
                <Button
                  className="px-7 py-5 w-32 cursor-pointer"
                  onClick={() => addMutation.mutate({ title, publicKey })}
                >
                  {t("settingAddKeyForm.saveBtn")}
                </Button>
              )}
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
