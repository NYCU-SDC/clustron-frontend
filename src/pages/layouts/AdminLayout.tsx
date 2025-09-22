import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "@/lib/token";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // 1. 導入 useTranslation
import { AccessToken } from "@/types/type";

// 2. 導入你新的通用 SideBar 組件和 NavItem 類型
import SideBar, { NavItem } from "@/components/ui/sidebar.tsx";

export default function AdminLayout() {
  const accessToken = getAccessToken();
  const [role, setRole] = useState<string>("");
  const navigate = useNavigate();
  const { t } = useTranslation(); // 3. 獲取 t 函數

  useEffect(() => {
    if (!accessToken) {
      navigate("/", { replace: true });
      return;
    }
    const decodedRole = jwtDecode<AccessToken>(accessToken).Role;
    setRole(decodedRole);
    if (decodedRole !== "admin") {
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  // 4. 定義 Admin 佈局專用的側邊欄數據
  const adminNavItems: NavItem[] = [
    {
      to: "/admin/role-access", // 假設這是你的路徑
      labelKey: "adminSidebar.roleAccessConfigLink",
    },
    // 如果有其他 Admin 連結，加在這裡
  ];

  if (role !== "admin") return null;

  return (
    <div className="flex w-full">
      <div className="min-w-xs border-r px-4">
        {" "}
        {/* 建議加一些 padding */}
        {/* 5. 使用 SideBar 組件並傳入 props */}
        <SideBar title={t("adminSidebar.title")} navItems={adminNavItems} />
      </div>
      <main className="flex-1 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}
