import SideBar, { NavItem } from "@/components/ui/sidebar.tsx";

export default function GroupSideBarContainer({ title }: { title: string }) {
  const jobNavItems: NavItem[] = [
    {
      to: `/joblist`,
      labelKey: "jobsSideBar.ListNavLink",
    },
    {
      to: `/jobform"`,
      labelKey: "jobsSideBar.SubmitNavLink",
    },
  ];

  return <SideBar title={title} navItems={jobNavItems} className="min-w-36" />;
}
