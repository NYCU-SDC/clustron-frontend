import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import "./i18n";

// context
import { GroupProvider } from "./context/GroupContext";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 建立 QueryClient 實例
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GroupProvider>
          <App />
        </GroupProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
