import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./index.css";
import App from "./App";
import "./i18n";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "@/components/ErrorFallBack";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <AuthProvider>
            <ThemeProvider storageKey="vite-ui-theme">
              <Toaster />
              <ErrorBoundary
                FallbackComponent={ErrorFallBack}
                onReset={() => window.location.replace("/")}
              >
                <App />
              </ErrorBoundary>
            </ThemeProvider>
          </AuthProvider>
        </CookiesProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
