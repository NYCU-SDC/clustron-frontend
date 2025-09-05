import { useEffect, useState, useMemo } from "react";
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
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings } from "@/lib/request/getSettings";
import { createBindMethods } from "@/lib/request/createBindMethods";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginMethodIcon } from "@/components/setting/LoginMethodIcon";
import { toast } from "sonner";

export default function BindLoginForm() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useTranslation();
  const PROFILE_QUERY_KEY = useMemo(() => ["connectedAccounts"], []);
  const queryClient = useQueryClient();

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getSettings,
  });

  const bindMutation = useMutation({
    mutationFn: (provider: "nycu" | "google") => createBindMethods(provider),
    onSuccess: (data) => {
      const url = data.url;
      const width = 1200;
      const height = 1800;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        url,
        "BindPopup",
        `width=${width},height=${height},left=${left},top=${top},resizable`,
      );

      if (!popup) {
        toast.error(t("bindLoginForm.popupBlockedToast"));
      }
    },
    onError: () => {
      toast.error(t("bindLoginForm.bindFailToast"));
    },
  });

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      setDialogOpen(false);
      if (event.data?.type === "BIND_SUCCESS") {
        toast.success(t("bindLoginForm.bindSuccessToast"));
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      } else if (event.data?.type === "BIND_CONFLICT") {
        toast.error(t("bindLoginForm.bindConflictToast"));
      } else if (event.data?.type === "BIND_FAIL") {
        toast.error(t("bindLoginForm.bindFailToast"));
      }
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [PROFILE_QUERY_KEY, queryClient, t]);

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
                <div
                  key={`${method.provider}-${method.email}`}
                  className="flex items-center gap-2"
                >
                  <LoginMethodIcon
                    type={method.provider.toLowerCase() as "nycu" | "google"}
                  />
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
        <Button
          className="px-7 py-5 ml-5 w-fit cursor-pointer"
          onClick={() => setDialogOpen(true)}
        >
          {t("bindLoginForm.connectLoginMethodBtn")}
        </Button>
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
                  bindMutation.mutate("nycu");
                }}
              >
                <LoginMethodIcon type="nycu" />
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
                  bindMutation.mutate("google");
                }}
              >
                <LoginMethodIcon type="google" />
                {t("bindLoginForm.googleLoginBtn")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
