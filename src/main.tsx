import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import "./i18n";
// main.tsx
import { GroupProvider } from "./context/GroupContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GroupProvider>
        <App />
      </GroupProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
