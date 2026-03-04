export const LivestreamCategoriesPageSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-6 pt-8">
        <div className="h-9 w-36 bg-gray-200 rounded-md" />
        <div className="h-9 w-52 bg-gray-200 rounded-md" />
      </div>

      {/* Table skeleton */}
      <div className="p-6 space-y-4">
        <div className="h-10 w-full bg-gray-100 rounded-md" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 w-full bg-gray-100 rounded-md" />
        ))}
      </div>
    </div>
  );
};
