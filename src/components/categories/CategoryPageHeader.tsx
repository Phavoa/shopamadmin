import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryPageHeaderProps {
  onAdd: () => void;
  onBack: () => void;
}

export const CategoryPageHeader: React.FC<CategoryPageHeaderProps> = ({
  onAdd,
  onBack,
}) => {
  return (
    <div className="flex items-center justify-between px-6 pt-8">
      <Button
        onClick={onBack}
        className="bg-gray-100 space-x-2 hover:bg-gray-200 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Settings
      </Button>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2 rounded-sm bg-[#E67E22] text-white text-sm font-medium border-none cursor-pointer hover:bg-orange-600 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Category
      </button>
    </div>
  );
};
