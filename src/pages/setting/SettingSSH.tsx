import SettingLinuxUsernameForm from "@/components/setting/SettingLinuxUsernameForm";
import UpdatePasswordForm from "@/components/setting/UpdatePasswordForm";
import SettingKeyTable from "@/components/setting/SettingKeyTable";

export default function SettingSSH() {
  return (
    <div className="w-full max-w-2xl px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6 md:gap-10">
      <SettingLinuxUsernameForm />
      <UpdatePasswordForm />
      <SettingKeyTable />
    </div>
  );
}
