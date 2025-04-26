import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Form from "@/pages/Form";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Onboarding" element={<Form />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
