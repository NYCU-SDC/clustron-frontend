import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import SettingLayout from "./pages/SettingLayout";
import SettingGeneral from "./pages/SettingGeneral";
import SettingAddKey from "./pages/SettingAddKey";
import SettingSSH from "./pages/SettingSSH";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Onboarding" element={<Onboarding />} />
          <Route path="/Setting" element={<SettingLayout />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<SettingGeneral />} />
            <Route path="ssh" element={<SettingSSH />} />
            <Route path="addNewKey" element={<SettingAddKey />} />
          </Route>
        </Routes>
        <Toaster />
      </ThemeProvider>
    </>
  );
};

export default App;
