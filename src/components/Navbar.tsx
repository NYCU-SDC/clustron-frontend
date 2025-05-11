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
            Groups
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
