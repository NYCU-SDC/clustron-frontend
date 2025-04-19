import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import Page2 from "@/pages/Page2";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/P2" element={<Page2 />} />
    </Routes>
  );
}
