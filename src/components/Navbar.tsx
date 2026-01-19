import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { authContext } from "@/lib/auth/authContext";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ColorModeToggle from "@/components/ColorModeToggle";
import { CircleUserRound } from "lucide-react";
import { getAccessToken } from "@/lib/token";
import { jwtDecode } from "jwt-decode";
import { AccessToken } from "@/types/settings";
import { LogOut } from "lucide-react";

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
  const { handleLogout, isLoggedIn } = useContext(authContext);
  const { t } = useTranslation();
  const accessToken = getAccessToken();
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (accessToken) {
      const decodedToken = jwtDecode<AccessToken>(accessToken);
      setEmail(decodedToken.Email);
      setRole(decodedToken.Role);
    }
  }, [accessToken]);

  return (
    <nav className="sticky top-0 z-1 w-full border-b bg-white dark:bg-black">
      <div className="flex items-center justify-between w-full px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold px-3 py-2">Clustron</div>
          <>
            {(role == "user" || role == "admin") && (
              <>
                <NavLink
                  to="/groups"
                  className={({ isActive }) => navLinkclass(isActive)}
                >
                  {t("navbar.groupLink")}
                </NavLink>
                {/* <NavLink
                          to="/jobs"
                          className={({ isActive }) => navLinkclass(isActive)}
                        >
                          {t("navbar.jobsLink")}
                        </NavLink> */}
                <NavLink
                  to="/setting"
                  className={({ isActive }) => navLinkclass(isActive)}
                >
                  {t("navbar.settingLink")}
                </NavLink>
              </>
            )}
            {role == "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) => navLinkclass(isActive)}
              >
                {t("navbar.adminLink")}
              </NavLink>
            )}
          </>
        </div>
        <div className="flex items-center space-x-4">
          <ColorModeToggle />
          {isLoggedIn() ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <CircleUserRound />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-gray-600 dark:text-gray-400">
                  {email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  {t("navbar.logoutBtn")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>{" "}
      </div>
    </nav>
  );
}
