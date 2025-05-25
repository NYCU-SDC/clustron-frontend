import SettingUsernameForm from "@/components/setting/SettingUsernameForm";
import SettingKeyTable from "@/components/setting/SettingKeyTable";

export default function SettingSSH() {
  return (
    <div className="w-full min-w-lg max-w-3xl px-6 py-8 flex flex-col gap-10">
      <SettingUsernameForm />
      <SettingKeyTable />
    </div>
  );
}
