import { Routes, Route } from "react-router-dom";
// import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import GroupPage from "@/pages/Group";
import CourseList from "@/pages/CourseList";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/Onboarding" element={<Onboarding />} />
        <Route path="/GroupMem" element={<GroupPage />} />
        <Route path="/AddMemberPage" element={<GroupPage />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
