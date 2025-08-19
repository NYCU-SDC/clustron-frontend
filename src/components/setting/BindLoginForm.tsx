import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getSettings } from "@/lib/request/getSettings";
import { createBindMethods } from "@/lib/request/createBindMethods";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginMethodIcon } from "@/components/setting/LoginMethodIcon";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function BindLoginForm() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useTranslation();
  const PROFILE_QUERY_KEY = ["settings"];

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getSettings,
  });

  const loginMutation = useMutation({
    mutationFn: (provider: "NYCU" | "GOOGLE") => createBindMethods(provider),
    onSuccess: (data) => {
      const url = data.url;
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      // const popup =
      window.open(
        url,
        "loginPopup",
        `width=${width},height=${height},left=${left},top=${top},resizable`,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // For demo popup window
  const openPopup = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popupHtml = `
      <html>
        <head><title>Clustron</title></head>
        <body style="display:flex;align-items:center;justify-content:center;height:90%;">
          <button id="finishBtn" style="padding:10px 20px;font-size:16px;">畢業了 嗎</button>
          <script>
            document.getElementById("finishBtn").onclick = function () {
              window.opener.postMessage({ type: "LOGIN_SUCCESS" }, "*");
              window.close();
            }
          </script>
        </body>
      </html>
    `;

    const popup = window.open(
      "",
      "loginPopup",
      `width=${width},height=${height},left=${left},top=${top},resizable`,
    );

    if (popup) {
      popup.document.write(popupHtml);
      popup.document.close();
    }
  };

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data?.type === "LOGIN_SUCCESS") {
        setDialogOpen(false);
        toast.success("綁定成功!!!");
      }
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  return (
    <Card className="flex flex-col gap-6">
      <CardHeader>
        <CardTitle className="text-2xl">
          {t("bindLoginForm.cardTitle")}
        </CardTitle>
        <CardDescription>{t("bindLoginForm.cardDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="font-semibold">
          {t("bindLoginForm.connectLoginMethods")}
        </div>
        <div className="flex flex-col gap-2 mt-3">
          {isLoading && (
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="h-5 w-48" />
            </div>
          )}
          {isError && <p className="text-sm text-destructive">Error</p>}
          {isSuccess &&
            (data.boundLoginMethods ? (
              data.boundLoginMethods.map((method) => (
                <div key={method.provider} className="flex items-center gap-2">
                  <LoginMethodIcon type={method.provider} />
                  <span className="text-gray-500 dark:text-gray-300">
                    {method.email}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm">Empty</p>
            ))}
        </div>
      </CardContent>
      <Separator />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger className="mr-auto" asChild>
          <Button className="px-7 py-5 ml-5 w-fit cursor-pointer">
            {t("bindLoginForm.connectLoginMethodBtn")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("bindLoginForm.dialogTitle")}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5 pb-10">
            <div>
              <div className="p-5 after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  {t("bindLoginForm.nycuLoginNote")}
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full p-6 cursor-pointer"
                onClick={() => {
                  loginMutation.mutate("NYCU");
                }}
              >
                <LoginMethodIcon type="NYCU" />
                {t("bindLoginForm.nycuLoginBtn")}
              </Button>
            </div>
            <div>
              <div className="p-5 after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  {t("bindLoginForm.googleLoginNote")}
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full p-6 cursor-pointer"
                onClick={() => {
                  // loginMutation.mutate("GOOGLE");
                  openPopup();
                }}
              >
                <LoginMethodIcon type="GOOGLE" />
                {t("bindLoginForm.googleLoginBtn")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
