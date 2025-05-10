import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Callback from "@/pages/Callback";

import Onboarding from "@/pages/Onboarding";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
