// src/components/ui/error-boundary.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

export function ErrorBoundary({
  children,
  fallback: FallbackComponent = DefaultErrorFallback,
}: ErrorBoundaryProps) {
  const [state, setState] = React.useState<ErrorBoundaryState>({
    hasError: false,
  });

  const resetError = React.useCallback(() => {
    setState({ hasError: false });
  }, []);

  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      setState({
        hasError: true,
        error: error.error,
      });
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (state.hasError) {
    return <FallbackComponent error={state.error} resetError={resetError} />;
  }

  return children;
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">
          {error?.message ||
            "An unexpected error occurred. Please try refreshing the page."}
        </p>
        <div className="space-y-3">
          <Button onClick={resetError} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
          >
            Reload Page
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export function ErrorFallback({
  error,
  onRetry,
  title = "Operation Failed",
  description = "The requested operation could not be completed. Please try again.",
}: ErrorFallbackProps & {
  onRetry?: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
