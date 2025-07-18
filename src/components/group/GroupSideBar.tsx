import { NavLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function GroupSideBar({ title }: { title: string }) {
  const { id } = useParams();
  const { t } = useTranslation();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full justify-start px-2 py-1 rounded text-sm ${
      isActive ? "text-primary font-medium" : "text-muted-foreground"
    }`;

  return (
    <aside className="w-64 border-r p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul className="space-y-2">
        <li>
          <NavLink to={`/groups/${id}`} end className={linkClass}>
            {({ isActive }) => (
              <Button variant="ghost" className={linkClass({ isActive })}>
                {t("groupComponents.groupSideBar.overview")}
              </Button>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to={`/groups/${id}/settings`} className={linkClass}>
            {({ isActive }) => (
              <Button variant="ghost" className={linkClass({ isActive })}>
                {t("groupComponents.groupSideBar.groupSettings")}
              </Button>
            )}
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
