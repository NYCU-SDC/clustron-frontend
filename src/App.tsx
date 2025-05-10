import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import Setting from "./pages/Setting";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Onboarding" element={<Onboarding />} />
          <Route path="/Settings" element={<Setting />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </>
  );
};

export default App;
