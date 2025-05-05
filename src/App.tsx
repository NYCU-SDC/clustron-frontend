import { Routes, Route } from "react-router-dom";
// import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import GroupPage from "@/pages/Group";
import CourseList from "@/pages/CourseList";
import { Toaster } from "@/components/ui/sonner";
import AddMemberPage from "@/pages/AddMemberPage";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/Onboarding" element={<Onboarding />} />
        <Route path="/group/:id/add-member" element={<AddMemberPage />} />
        <Route path="/group/:id" element={<GroupPage />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
