import { NavLink } from "react-router";
import type { NavItem } from "@/components/Sidebar";

type Props = {
  title: string;
  ldapGroupName: string;
  navItems: NavItem[];
};

export default function GroupMobileHeader({
  title,
  ldapGroupName,
  navItems,
}: Props) {
  return (
    <header className="border-b px-4 py-4 md:hidden">
      <div className="mb-3">
        <h1 className="text-3xl font-bold leading-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">#{ldapGroupName}</p>
      </div>
      <nav className="flex gap-2 overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end ?? true}
            className={({ isActive }) =>
              isActive
                ? "inline-flex h-9 items-center rounded-md bg-muted px-3 text-sm font-medium text-foreground"
                : "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
