import { NavLink } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import { CircleUserRound } from "lucide-react";

export default function Navbar() {
  const { setTheme } = useTheme();
  return (
    <nav className="w-full border-b">
      <div className="flex items-center justify-between w-full px-6 py-4">
        <div className="flex items-center space-x-4">
          <NavLink to="/" className="text-2xl font-bold px-3 py-2">
            Clustron
          </NavLink>
          <NavLink
            to="/groups"
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
            Groups
          </NavLink>
          <NavLink
            to="/setting"
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
            Settings
          </NavLink>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <CircleUserRound strokeWidth={1.5} className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Language</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>English</DropdownMenuItem>
                      <DropdownMenuItem>繁體中文</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { useTranslation } from "react-i18next";
import LangSwitcher from "@/components/LangSwitcher";
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
          <LangSwitcher />
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
