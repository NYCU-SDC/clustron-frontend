import LangSwitcher from "@/components/LangSwitcher";
import SettingFullNameForm from "@/components/setting/SettingFullNameForm";
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
    <div className="min-w-2xl max-w-2xl px-6 py-8 flex flex-col gap-10">
      <SettingFullNameForm />
      <Card>
        <CardHeader>
          <div className="flex justify-between">
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
    </div>
  );
}
