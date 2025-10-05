// import SideBar, { NavItem } from "@/components/sidebar";
// import { useTranslation } from "react-i18next";

// export default function SettingSideBarContainer({ title }: { title: string }) {
//   console.log("setting sidebar rendering");

//   const { t } = useTranslation();

//   const settingNavItems: NavItem[] = [
//     {
//       to: "/setting/general",
//       label: t("settingSideBar.GeneralNavLink"),
//     },
//     {
//       to: "/setting/ssh",
//       label: t("settingSideBar.SSHNavLink"),
//     },
//   ];
//   console.log("傳遞給 SideBar 的 navItems:", settingNavItems);
//   return (
//     <SideBar title={title} navItems={settingNavItems} className="min-w-36" />
//   );
// }
