import { Routes, Route } from "react-router-dom";
// import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import GroupPage from "@/pages/Group";
import CourseList from "@/pages/CourseList";
import GroupOverview from "@/pages/GroupOverview";
import GroupSettings from "@/pages/GroupSettings";
import { Toaster } from "@/components/ui/sonner";
import AddMemberPage from "@/pages/AddMemberPage";
import AddGroupPage from "@/pages/AddGroup";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/add-group" element={<AddGroupPage />} />
        <Route path="/Onboarding" element={<Onboarding />} />
        <Route path="/add-group" element={<AddGroupPage />} />
        <Route path="/group/:id" element={<GroupPage />}>
          <Route index element={<GroupOverview />} />
          <Route path="settings" element={<GroupSettings />} />
          <Route path="add-member" element={<AddMemberPage />} />
        </Route>
      </Routes>

      <Toaster />
    </>
  );
};

export default App;
