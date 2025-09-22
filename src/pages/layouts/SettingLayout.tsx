import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next"; // 1. 導入 useTranslation

// 2. 導入你新的通用 SideBar 組件和 NavItem 類型
import SideBar, { NavItem } from "@/components/ui/sidebar.tsx";

export default function SettingLayout() {
  const { t } = useTranslation(); // 3. 獲取 t 函數

  // 4. 定義 Setting 佈局專用的側邊欄數據
  const settingNavItems: NavItem[] = [
    {
      to: "/setting/general",
      labelKey: "settingSideBar.GeneralNavLink",
    },
    {
      to: "/setting/ssh",
      labelKey: "settingSideBar.SSHNavLink",
    },
    // 如果有其他 Setting 連結，加在這裡
  ];

  return (
    <div className="flex w-full">
      <div className="min-w-xs border-r px-4">
        {" "}
        {/* 建議加一些 padding */}
        {/* 5. 使用 SideBar 組件並傳入 props */}
        <SideBar title={t("settingSideBar.title")} navItems={settingNavItems} />
      </div>
      <main className="flex-1 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}
