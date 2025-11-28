import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 mb-4">Error loading categories</p>
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </div>
  );
};
