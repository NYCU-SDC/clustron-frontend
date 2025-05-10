import { NavLink } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  // DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ModeToggle from "@/components/ModeToggle";
import ProfileImg from "@/assets/Profile.png";

export default function Navbar() {
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
                "text-base hover:bg-gray-100",
                "px-3 py-2 rounded-lg",
                !isActive && "text-gray-500",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            Groups
          </NavLink>
          <NavLink
            to="/Settings"
            className={({ isActive }) =>
              [
                "text-base hover:bg-gray-100",
                "px-3 py-2 rounded-lg",
                !isActive && "text-gray-500",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            Settings
          </NavLink>
        </div>
        <div className="flex items-center space-x-4">
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={ProfileImg} alt="User" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
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
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
