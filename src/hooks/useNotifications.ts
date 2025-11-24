// src/hooks/useNotifications.ts

import { useCallback } from "react";
import { toast } from "sonner";

interface NotificationOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AsyncOperationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export function useNotifications() {
  const showSuccess = useCallback(
    (message: string, options?: NotificationOptions) => {
      toast.success(message, {
        duration: options?.duration || 4000,
        description: options?.description,
        action: options?.action,
      });
    },
    []
  );

  const showError = useCallback(
    (message: string, options?: NotificationOptions) => {
      toast.error(message, {
        duration: options?.duration || 6000,
        description: options?.description,
        action: options?.action,
      });
    },
    []
  );

  const showInfo = useCallback(
    (message: string, options?: NotificationOptions) => {
      toast.info(message, {
        duration: options?.duration || 4000,
        description: options?.description,
        action: options?.action,
      });
    },
    []
  );

  const showWarning = useCallback(
    (message: string, options?: NotificationOptions) => {
      toast.warning(message, {
        duration: options?.duration || 5000,
        description: options?.description,
        action: options?.action,
      });
    },
    []
  );

  const handleAsyncOperation = useCallback(
    async <T>(
      operation: () => Promise<T>,
      options: AsyncOperationOptions<T> = {}
    ): Promise<T | undefined> => {
      const {
        onSuccess,
        onError,
        successMessage = "Operation completed successfully",
        errorMessage = "Operation failed. Please try again.",
        showSuccessToast = false,
        showErrorToast = true,
      } = options;

      try {
        const result = await operation();

        if (showSuccessToast && successMessage) {
          showSuccess(successMessage);
        }

        onSuccess?.(result);
        return result;
      } catch (error) {
        if (showErrorToast && errorMessage) {
          showError(errorMessage, {
            description: error instanceof Error ? error.message : undefined,
          });
        }

        onError?.(error);
        throw error;
      }
    },
    [showSuccess, showError]
  );

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    handleAsyncOperation,
  };
}
