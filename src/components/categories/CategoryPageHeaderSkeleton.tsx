import { Skeleton } from "@/components/ui/skeleton";

interface CategoryPageHeaderSkeletonProps {
  onBack?: () => void;
  onAdd?: () => void;
}

export const CategoryPageHeaderSkeleton: React.FC<
  CategoryPageHeaderSkeletonProps
> = ({ onBack, onAdd }) => {
  return (
    <div className="flex items-center justify-between px-6 pt-8">
      {/* Back button skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="w-32 h-6 rounded-sm" />
      </div>

      {/* Add Category button skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="w-24 h-8 rounded-sm" />
      </div>
    </div>
  );
};
