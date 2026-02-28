import { Routes, Route, Navigate } from "react-router";
import DefaultLayout from "./pages/layouts/DefaultLayout";
import Login from "@/pages/Login";
import SystemSetupGate from "@/components/system/SystemSetupGate";
import SetupPage from "@/pages/auth/Setup.tsx";
import LoginCallback from "@/pages/LoginCallback";
import Onboarding from "@/pages/Onboarding";
import SettingLayout from "@/pages/layouts/SettingLayout";
import SettingGeneral from "@/pages/setting/SettingGeneral";
import SettingAddKey from "@/pages/setting/SettingAddKey";
import SettingSSH from "@/pages/setting/SettingSSH";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestOnlyRoute from "@/components/auth/GuestOnlyRoute";
import GroupPage from "@/pages/group/GroupPage";
import GroupListPage from "@/pages/group/GroupList";
import GroupOverview from "@/pages/group/GroupOverview";
import GroupSettings from "@/pages/group/GroupSettings";
import AddMemberPage from "@/pages/group/AddMemberPage";
import AddGroupPage from "@/pages/group/CreateGroup";
import GroupLayout from "@/pages/layouts/GroupLayout";
import AddMemberResult from "@/pages/group/AddMemberResult";
// import JobDashboard from "@/pages/job/JobDashboard";
import AdminLayout from "@/pages/layouts/AdminLayout";
import RoleConfiguration from "@/pages/admin/RoleConfiguration";
import UserConfiguration from "@/pages/admin/UserConfiguration";
import BindCallback from "@/pages/BindCallback";
// import JobSubmitPage from "@/pages/JobSubmitPage";
// import JobLayout from "@/pages/layouts/JobLayout";
import ErrorBoundary from "@/components/ErrorBoundary";

const App = () => {
  return (
    <Routes>
      <Route path="/callback">
        <Route
          path="login"
          element={
            <ErrorBoundary>
              <LoginCallback />
            </ErrorBoundary>
          }
        />
        <Route
          path="bind"
          element={
            <ErrorBoundary>
              <BindCallback />
            </ErrorBoundary>
          }
        />
      </Route>

      <Route path="/health" element={<div>Health Check</div>} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DefaultLayout />}>
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>
      </Route>

      <Route element={<SystemSetupGate />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/groups" replace />} />
          <Route element={<DefaultLayout />}>
            <Route path="/setting" element={<SettingLayout />}>
              <Route index element={<Navigate to="general" replace />} />
              <Route path="general" element={<SettingGeneral />} />
              <Route path="ssh" element={<SettingSSH />} />
              <Route path="ssh/new" element={<SettingAddKey />} />
            </Route>
            <Route path="/groups" element={<GroupListPage />} />
            <Route path="/groups/new" element={<AddGroupPage />} />
            <Route path="/add-group" element={<AddGroupPage />} />
            <Route
              path="/groups/:id/add-member-result"
              element={<AddMemberResult />}
            />
            {/*<Route path="/jobs" element={<JobLayout />}>
              <Route index element={<JobDashboard />} />
              <Route path="submit" element={<JobSubmitPage />} />
            </Route>*/}

            <Route element={<GroupLayout />}>
              <Route path="/groups/:id" element={<GroupPage />}>
                <Route index element={<GroupOverview />} />
                <Route path="settings" element={<GroupSettings />} />
                <Route path="add-member" element={<AddMemberPage />} />
              </Route>
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="config" replace />} />
              <Route path="config" element={<RoleConfiguration />} />
              <Route path="users" element={<UserConfiguration />} />
            </Route>
          </Route>
        </Route>

        <Route element={<GuestOnlyRoute />}>
          <Route element={<DefaultLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Route>

        <Route element={<DefaultLayout />}>
          <Route path="/system-setup" element={<SetupPage />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <div>
            404 Not Found. Click{" "}
            <a className="text-blue-500" href="/">
              here
            </a>{" "}
            to go back home.
          </div>
        }
      />
    </Routes>
  );
};

export default App;
