import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "./ErrorBoundary";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const truncateMiddle = (
  text: string,
  maxLength: number = 15,
): string => {
  if (text.length <= maxLength) return text;

  const charsToShow = maxLength - 3;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return `${text.slice(0, frontChars)}...${text.slice(-backChars)}`;
};

function navLinkClass(isActive: boolean): string {
  return [
    "text-base",
    "w-full block",
    "px-2 py-2 rounded-lg",
    !isActive && "text-gray-500 dark:text-gray-400 hover:bg-gray-200",
  ]
    .filter(Boolean)
    .join(" ");
}

export interface NavItem {
  to: string;
  label: string;

  /**
   * Controls NavLink active matching behavior.
   * - true: exact match only ("/setting/ssh" is active only on "/setting/ssh")
   * - false: prefix match ("/setting/ssh" is also active on "/setting/ssh/new")
   *
   * Default: true (keep existing behavior for other sidebars).
   */
  end?: boolean;
}

interface SideBarProps {
  title: string;
  navItems: NavItem[];
  className?: string;
}

export default function SideBar({ title, navItems, className }: SideBarProps) {
  const { t } = useTranslation();

  const displayTitle = truncateMiddle(title, 15);

  return (
    <ErrorBoundary>
      <aside
        className={`sticky top-[7rem] self-start ml-15 my-8 ${className || ""}`}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-4xl font-semibold mb-8 cursor-default">
                {displayTitle}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end ?? true}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {t(item.label)}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </ErrorBoundary>
  );
}
