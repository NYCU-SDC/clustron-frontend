import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import Setting from "./pages/Setting";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Onboarding" element={<Onboarding />} />
        <Route path="/Setting" element={<Setting />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
