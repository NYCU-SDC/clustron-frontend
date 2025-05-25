import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./index.css";
import App from "./App.tsx";
import "./i18n";
import { Toaster } from "@/components/ui/sonner";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <Toaster />
              <App />
            </ThemeProvider>
          </QueryClientProvider>
        </AuthProvider>
      </CookiesProvider>
    </BrowserRouter>
  </StrictMode>,
);
