import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "./pages/layouts/DefaultLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Callback from "@/pages/Callback";
import Onboarding from "@/pages/Onboarding";
import SettingLayout from "@/pages/layouts/SettingLayout";
import SettingGeneral from "./pages/setting/SettingGeneral";
import SettingAddKey from "./pages/setting/SettingAddKey";
import SettingSSH from "./pages/setting/SettingSSH";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestOnlyRoute from "./components/auth/GuestOnlyRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/callback" element={<Callback />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<DefaultLayout />}>
          <Route path="/setting" element={<SettingLayout />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<SettingGeneral />} />
            <Route path="ssh" element={<SettingSSH />} />
            <Route path="add-new-key" element={<SettingAddKey />} />
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
