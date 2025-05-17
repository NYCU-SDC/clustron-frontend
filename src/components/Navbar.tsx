import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LangSwitch";
import { useContext } from "react";
import { authContext } from "@/lib/auth/authContext";

export function navLinkclass(isActive: boolean) {
  return [
    "text-base px-3 py-2 rounded-lg",
    "hover:bg-gray-100 dark:hover:bg-gray-600",
    isActive ? "" : "text-gray-500 dark:text-gray-400",
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Navbar() {
  const navigate = useNavigate();
  const { logout, isLoggedIn } = useContext(authContext);
  const { t } = useTranslation();

  return (
    <nav className="w-full border-b">
      <div className="flex items-center justify-between w-full px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold px-3 py-2">Clustron</div>
          {isLoggedIn() && (
            <>
              <NavLink
                to="/groups"
                className={({ isActive }) => navLinkclass(isActive)}
              >
                {t("navbar.groupLink")}
              </NavLink>
              <NavLink
                to="/setting"
                className={({ isActive }) => navLinkclass(isActive)}
              >
                {t("navbar.settingLink")}
              </NavLink>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <LanguageSwitcher />
          {isLoggedIn() ? (
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={logout}
            >
              {t("navbar.logoutBtn")}
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={() => navigate("/login")}
            >
              {t("navbar.loginBtn")}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
