// src/components/ui/empty-state.tsx

import { Button } from "@/components/ui/button";
import { PackageIcon, TruckIcon } from "@/components/logistics/LogisticsIcons";
import { RefreshCw } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  children?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon: Icon = PackageIcon,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="text-center max-w-md">
        <Icon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        {action && (
          <Button
            onClick={action.onClick}
            disabled={action.loading}
            variant="outline"
            className="flex items-center gap-2 m-auto"
          >
            {action.loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
            {action.label}
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}

export function OrdersEmptyState({
  onRefresh,
  isLoading = false,
}: {
  onRefresh: () => void;
  isLoading?: boolean;
}) {
  return (
    <EmptyState
      title="No Orders Found"
      description="There are currently no pickup requests or delivery orders to display. Check back later or refresh to see the latest updates."
      icon={TruckIcon}
      action={{
        label: "Refresh Orders",
        onClick: onRefresh,
        loading: isLoading,
      }}
    />
  );
}
