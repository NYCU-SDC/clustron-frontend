import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LangSwitch";

export default function Navbar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <nav className="w-full border-b">
      <div className="flex items-center justify-between w-full px-6 py-4">
        <div className="flex items-center space-x-4">
          <NavLink
            to="#"
            className="text-2xl font-bold px-3 py-2 !cursor-default"
          >
            Clustron
          </NavLink>
          <NavLink
            to="/Groups"
            className={({ isActive }) =>
              [
                "text-base hover:bg-gray-100 dark:hover:bg-gray-600",
                "px-3 py-2 rounded-lg",
                !isActive && "text-gray-500 dark:text-gray-400",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            {t("navbar.groupLink")}
          </NavLink>
          <NavLink
            to="/Setting"
            className={({ isActive }) =>
              [
                "text-base hover:bg-gray-100 dark:hover:bg-gray-600",
                "px-3 py-2 rounded-lg",
                !isActive && "text-gray-500 dark:text-gray-400",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            {t("navbar.settingLink")}
          </NavLink>
        </div>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <LanguageSwitcher />
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={() => navigate("/login")}
          >
            {t("navbar.loginBtn")}
          </Button>
        </div>
      </div>
    </nav>
  );
}
