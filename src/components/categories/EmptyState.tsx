import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateFirst: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateFirst }) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">No categories found</p>
      <Button onClick={onCreateFirst}>Create First Category</Button>
    </div>
  );
};
