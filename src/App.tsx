import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import Onboarding from "@/pages/Onboarding";
import GroupPage from "@/pages/Group";
import CourseList from "@/pages/CourseList";
import GroupOverview from "@/pages/GroupOverview";
import GroupSettings from "@/pages/GroupSettings";
import AddMemberPage from "@/pages/AddMemberPage";
import AddGroupPage from "@/pages/AddGroup";
import CourseDescriptionPage from "@/pages/CourseDescriptionPage";
import { GroupProvider } from "@/context/GroupContext";
import { UserProvider } from "@/context/UserContext";

const App = () => {
  return (
    <UserProvider>
      <GroupProvider>
        <Routes>
          <Route path="/" element={<CourseList />} />
          <Route path="/add-group" element={<AddGroupPage />} />
          <Route path="/:id" element={<CourseDescriptionPage />} />
          <Route path="/Onboarding" element={<Onboarding />} />
          <Route path="/group/:id" element={<GroupPage />}>
            <Route index element={<GroupOverview />} />
            <Route path="settings" element={<GroupSettings />} />
            <Route path="add-member" element={<AddMemberPage />} />
          </Route>
        </Routes>
        <Toaster />
      </GroupProvider>
    </UserProvider>
  );
};

export default App;
