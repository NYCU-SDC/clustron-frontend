import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "./ErrorFallBack";

export default function ErrorBoundary({
  children,
  isInline = false,
}: {
  children: React.ReactNode;
  isInline?: boolean;
}) {
  return (
    <ReactErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallBack {...props} isInline={isInline} />
      )}
    >
      {children}
    </ReactErrorBoundary>
  );
}
