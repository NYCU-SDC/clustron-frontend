import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function navLinkClass(isActive: boolean): string {
  return [
    "text-base",
    "w-full block", // Added for better click area
    "pl-1 py-2 rounded-lg",
    // Conditionally add inactive styles
    !isActive && "text-gray-500 dark:text-gray-400 hover:bg-gray-200",
  ]
    .filter(Boolean) // This clever trick removes any 'false' values from the array
    .join(" ");
}

// 2. Define the shape of a navigation link object with TypeScript
export interface NavItem {
  to: string;
  labelKey: string; // We'll pass the translation key
}

// 3. Define the props for our new generic component
interface SideBarProps {
  title: string;
  navItems: NavItem[];
  className?: string; // Optional prop for custom styling like min-width
}

// 4. Create the single, reusable SideBar component
export default function SideBar({ title, navItems, className }: SideBarProps) {
  const { t } = useTranslation();

  return (
    <aside
      className={`sticky top-[7rem] self-start ml-15 my-8 ${className || ""}`}
    >
      <div className="text-4xl font-semibold mb-8">{title}</div>
      <ul className="space-y-4">
        {/* 5. Map over the 'navItems' prop to render the links dynamically */}
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end // 'end' prop ensures parent routes don't stay active
              className={({ isActive }) => navLinkClass(isActive)}
            >
              {t(item.labelKey)}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
