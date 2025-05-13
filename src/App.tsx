import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Callback from "@/pages/Callback";
import Onboarding from "@/pages/Onboarding";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
