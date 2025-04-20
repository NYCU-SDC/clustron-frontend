import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Home2 from "@/pages/Home2";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/page2" element={<Home2 />} />
    </Routes>
  );
}
