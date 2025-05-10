import { NavLink } from "react-router";
import ModeToggle from "./ModeToggle";
import { Button } from "@/components/ui/button";

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
                "text-base",
                "px-3 py-2 rounded-lg",
                isActive
                  ? "text-gray-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-600",
              ].join(" ")
            }
          >
            Groups
          </NavLink>
          <NavLink
            to="/Settings"
            className={({ isActive }) =>
              [
                "text-base",
                "px-3 py-2 rounded-lg",
                isActive
                  ? "text-gray-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700",
              ].join(" ")
            }
          >
            Settings
          </NavLink>
        </div>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button
            variant="ghost"
            className="text-base px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
