import { withErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "./ErrorFallBack";

function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return children;
}

export default withErrorBoundary(ErrorBoundaryWrapper, {
  FallbackComponent: ErrorFallBack,
});
