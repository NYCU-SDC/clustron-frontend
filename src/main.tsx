import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./index.css";
import App from "./App.tsx";
import "./i18n";
import { Toaster } from "@/components/ui/sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Toaster />
            <App />
          </ThemeProvider>
        </AuthProvider>
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
