import { Onboarding } from "@/components/Onboarding";
import LanguageSwitcher from "@/components/LangSwitch";

export default function Form() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-end">
        <LanguageSwitcher />
      </div>

      <Onboarding defaultData={{}} />
    </div>
  );
}
