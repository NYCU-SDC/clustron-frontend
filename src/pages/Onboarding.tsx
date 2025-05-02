import { OnboardingForm } from "@/components/OnboardingForm";
import LanguageSwitcher from "@/components/LangSwitch";

export default function Onboarding() {
  return (
    <div className="h-screen flex flex-col p-6 space-y-4">
      <div className="flex justify-end">
        <LanguageSwitcher />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <OnboardingForm defaultData={{}} />
      </div>
    </div>
  );
}
