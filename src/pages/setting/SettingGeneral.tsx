import LangSwitcher from "@/components/LangSwitcher";
import SettingFullNameForm from "@/components/setting/SettingFullNameForm";
import BindLoginForm from "@/components/setting/BindLoginForm";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function SettingGeneral() {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-2xl px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6 md:gap-10">
      <SettingFullNameForm />
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
            <div className="flex flex-col gap-1.5">
              <CardTitle className="text-2xl">
                {t("settingFullNameForm.cardTitleForLanguage")}
              </CardTitle>
              <CardDescription>
                {t("settingFullNameForm.cardDescriptionForLanguage")}
              </CardDescription>
            </div>
            <LangSwitcher />
          </div>
        </CardHeader>
      </Card>
      <BindLoginForm />
    </div>
  );
}
