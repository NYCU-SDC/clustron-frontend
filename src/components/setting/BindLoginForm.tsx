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
import nycuLightImg from "@/assets/NYCU_Light.png";
import nycuDarkImg from "@/assets/NYCU_Dark.png";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/lib/request/getSettings";
import { createBindMethods } from "@/lib/request/createBindMethods";
import { Skeleton } from "@/components/ui/skeleton";

const LoginMethodIcon = ({ type }: { type: "google" | "nycu" }) => {
  switch (type) {
    case "nycu":
      return (
        <>
          <img src={nycuLightImg} className="w-5 h-5 block dark:hidden"></img>
          <img src={nycuDarkImg} className="w-5 h-5 hidden dark:block"></img>
        </>
      );
    case "google":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-5 h-5"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          ></path>
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          ></path>
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
        </svg>
      );
  }
};

export default function BindLoginForm() {
  const { t } = useTranslation();
  // const queryClient = useQueryClient();
  const PROFILE_QUERY_KEY = ["settings"];

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getSettings,
  });

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
            <>
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="h-5 w-48" />
              </div>
            </>
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
      <Dialog>
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
                  createBindMethods("nycu");
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
                onClick={() => createBindMethods("google")}
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
