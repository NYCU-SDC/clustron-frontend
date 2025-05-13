import SettingUsernameForm from "@/components/SettingUsernameForm";
import SettingKeyTable from "@/components/SettingKeyTable";

export default function SettingSsh() {
  return (
    <div className="w-full max-w-3xl px-6 py-8 flex flex-col gap-10">
      <SettingUsernameForm />
      <SettingKeyTable />
    </div>
  );
}
