import React, { ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children?: ReactNode;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  // constructor(props) {
  //   super(props);
  //   this.state = {hasError : false};
  // }

  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
