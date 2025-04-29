import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import LoginCallback from "@/pages/LoginCallback";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/callback" element={<LoginCallback />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
