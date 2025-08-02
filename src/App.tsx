import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "./pages/layouts/DefaultLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Callback from "@/pages/Callback";
import Onboarding from "@/pages/Onboarding";
import SettingLayout from "@/pages/layouts/SettingLayout";
import SettingGeneral from "@/pages/setting/SettingGeneral";
import SettingAddKey from "@/pages/setting/SettingAddKey";
import SettingSSH from "@/pages/setting/SettingSSH";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestOnlyRoute from "@/components/auth/GuestOnlyRoute";
import GroupPage from "@/pages/GroupPage";
import GroupListPage from "@/pages/GroupList";
import GroupOverview from "@/pages/GroupOverview";
import GroupSettings from "@/pages/GroupSettings";
import AddMemberPage from "@/pages/AddMemberPage";
import AddGroupPage from "@/pages/CreateGroup";
import GroupLayout from "@/pages/layouts/GroupLayout.tsx";
import AddMemberResult from "@/pages/AddMemberResult";
const App = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute showLoginRequiredToast={false} />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="/callback" element={<Callback />} />
      <Route path="/health" element={<div>Health Check</div>} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DefaultLayout />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/setting" element={<SettingLayout />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<SettingGeneral />} />
            <Route path="ssh" element={<SettingSSH />} />
            <Route path="add-new-key" element={<SettingAddKey />} />
          </Route>
          <Route path="/groups" element={<GroupListPage />} />
          <Route path="/groups/new" element={<AddGroupPage />} />
          <Route path="/add-group" element={<AddGroupPage />} />
          <Route element={<GroupLayout />}>
            <Route path="/groups" element={<GroupListPage />} />
            <Route path="/groups/new" element={<AddGroupPage />} />
            <Route
              path="/groups/:id/add-member-result"
              element={<AddMemberResult />}
            />
            <Route path="/groups/:id/add-member" element={<AddMemberPage />} />
            <Route path="/add-group" element={<AddGroupPage />} />
            <Route path="/groups/:id" element={<GroupPage />}>
              <Route index element={<GroupOverview />} />
              <Route path="settings" element={<GroupSettings />} />
              <Route path="add-member" element={<AddMemberPage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route element={<GuestOnlyRoute />}>
        <Route element={<DefaultLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
