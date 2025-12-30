import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext } from "react";
import { authContext } from "@/lib/auth/authContext";
import { useTranslation } from "react-i18next";
import { LoginMethodIcon } from "@/components/setting/LoginMethodIcon";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useContext(authContext);
  const { t } = useTranslation();

  return (
    <div className={cn("", className)} {...props}>
      <Card className="p-5">
        <CardHeader>
          <CardTitle className="text-2xl">{t("login.loginTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5 pb-10">
            <div>
              <div className="p-5 after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  {t("login.nycuLoginNote")}
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full p-6 cursor-pointer"
                onClick={() => login("nycu")}
              >
                <LoginMethodIcon type="nycu" />
                {t("login.nycuLoginBtn")}
              </Button>
            </div>
            <div>
              <div className="p-5 after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  {t("login.googleLoginNote")}
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full p-6 cursor-pointer"
                onClick={() => login("google")}
              >
                <LoginMethodIcon type="google" />
                {t("login.googleLoginBtn")}
              </Button>
              <Button
                variant="outline"
                className="w-full p-6 cursor-pointer mt-3"
                onClick={() => login("github")}
              >
                <LoginMethodIcon type="github" />
                {t("login.githubLoginBtn")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
