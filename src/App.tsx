import { Routes, Route } from "react-router-dom";

import Onboarding from "@/pages/Onboarding";
import GroupPage from "@/pages/Group";
import GroupList from "@/pages/GroupList";
import GroupOverview from "@/pages/GroupOverview";
import GroupSettings from "@/pages/GroupSettings";
import AddMemberPage from "@/pages/AddMemberPage";
import AddGroupPage from "@/pages/AddGroup";
import CourseDescriptionPage from "@/pages/CourseDescriptionPage";

const App = () => {
  return (
    <Routes>
      <Route path="/groups" element={<GroupList />} />
      <Route path="/groups/new" element={<AddGroupPage />} />
      <Route path="/groups/:id/info" element={<CourseDescriptionPage />} />
      <Route path="/Onboarding" element={<Onboarding />} />
      <Route path="/groups/:id" element={<GroupPage />}>
        <Route index element={<GroupOverview />} />
        <Route path="settings" element={<GroupSettings />} />
        <Route path="add-member" element={<AddMemberPage />} />
      </Route>
    </Routes>
  );
};

export default App;
