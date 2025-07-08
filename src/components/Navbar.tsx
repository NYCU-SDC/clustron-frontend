import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { authContext } from "@/lib/auth/authContext";
import ColorModeToggle from "@/components/ColorModeToggle";

function navLinkclass(isActive: boolean) {
  return [
    "text-base px-3 py-2 rounded-lg",
    "hover:bg-gray-100 dark:hover:bg-gray-600",
    isActive ? "" : "text-gray-500 dark:text-gray-400",
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Navbar() {
  const { logout, isLoggedIn } = useContext(authContext);
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 w-full border-b bg-white dark:bg-black">
      <div className="flex items-center justify-between w-full px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold px-3 py-2">Clustron</div>
          {isLoggedIn() && window.location.pathname != "/onboarding" && (
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
          <ColorModeToggle />
          {isLoggedIn() ? (
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={logout}
            >
              {t("navbar.logoutBtn")}
            </Button>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
