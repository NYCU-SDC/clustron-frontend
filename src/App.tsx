import { Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Callback from "@/pages/Callback";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestOnlyRoute from "@/components/auth/GuestOnlyRoute";

import Onboarding from "@/pages/Onboarding";
import GroupPage from "@/pages/GroupPage";
import GroupList from "@/pages/GroupList";
import GroupOverview from "@/pages/GroupOverview";
import GroupSettings from "@/pages/GroupSettings";
import AddMemberPage from "@/pages/AddMemberPage";
import AddGroupPage from "@/pages/AddGroup";
import CourseDescriptionPage from "@/pages/CourseDescriptionPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <GuestOnlyRoute>
            <Login />
          </GuestOnlyRoute> //TODO?
        }
      />
      <Route path="/callback" element={<Callback />} />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups"
        element={
          // <ProtectedRoute>
          <GroupList />
          // </ProtectedRoute>
        }
      />
      <Route
        path="/groups/new"
        element={
          <ProtectedRoute>
            <AddGroupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/:id/info"
        element={
          <ProtectedRoute>
            <CourseDescriptionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/:id"
        element={
          <ProtectedRoute>
            <GroupPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<GroupOverview />} />
        <Route path="settings" element={<GroupSettings />} />
        <Route path="add-member" element={<AddMemberPage />} />
      </Route>
    </Routes>
  );
};

export default App;
