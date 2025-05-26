import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "./pages/layouts/DefaultLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Callback from "@/pages/Callback";
import Onboarding from "@/pages/Onboarding";
import SettingLayout from "@/pages/layouts/SettingLayout";
import SettingGeneral from "./pages/SettingGeneral";
import SettingAddKey from "./pages/SettingAddKey";
import SettingSSH from "./pages/SettingSSH";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestOnlyRoute from "./components/auth/GuestOnlyRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      <Route element={<DefaultLayout />}>
        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <Login />
            </GuestOnlyRoute>
          }
        />
      </Route>

      <Route path="/callback" element={<Callback />} />

      <Route element={<DefaultLayout />}>
        <Route
          path="/setting"
          element={
            <ProtectedRoute>
              <SettingLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="general" replace />} />
          <Route path="general" element={<SettingGeneral />} />
          <Route path="ssh" element={<SettingSSH />} />
          <Route path="add-new-key" element={<SettingAddKey />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
