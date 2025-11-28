import { Skeleton } from "@/components/ui/skeleton";
import { CategoryPageHeaderSkeleton } from "./CategoryPageHeaderSkeleton";
import { CategoryTableSkeleton } from "./CategoryTableSkeleton";

export const CategoriesPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen">
      <CategoryPageHeaderSkeleton />

      <div className="p-6">
        <div className="space-y-6">
          {/* Title/Description skeleton */}
          <div className="space-y-2">
            <Skeleton className="w-64 h-8" />
            <Skeleton className="w-96 h-4" />
          </div>

          {/* Table skeleton */}
          <CategoryTableSkeleton rows={6} />
        </div>
      </div>
    </div>
  );
};
