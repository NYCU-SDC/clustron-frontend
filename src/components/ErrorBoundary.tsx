import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "./ErrorFallBack";

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactErrorBoundary
      fallbackRender={(props) => <ErrorFallBack {...props} />}
    >
      {children}
    </ReactErrorBoundary>
  );
}
