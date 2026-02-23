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
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

/**
 * Normalizes URL path to lowercase.
 * While React Router is case-insensitive, URLs should be treated as case-sensitive
 * for consistency. Redirects use { replace: true } to avoid breaking browser history.
 * Reference: https://developers.google.com/search/docs/crawling-indexing/url-structure
 */

const CaseNormalization = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (/[A-Z]/.test(pathname)) {
      navigate(pathname.toLowerCase() + search, { replace: true });
    }
  }, [pathname, navigate, search]);

  return null;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CaseNormalization />
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
