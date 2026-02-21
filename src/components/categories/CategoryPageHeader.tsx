import { ArrowLeft, Plus, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryPageHeaderProps {
  onAdd: () => void;
  onBack: () => void;
  /** Optional: navigate to the Livestream Categories management page */
  onLivestreamCategories?: () => void;
}

export const CategoryPageHeader: React.FC<CategoryPageHeaderProps> = ({
  onAdd,
  onBack,
  onLivestreamCategories,
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

      <div className="flex items-center gap-3">
        {onLivestreamCategories && (
          <button
            onClick={onLivestreamCategories}
            className="flex items-center gap-2 px-5 py-2 rounded-sm bg-white text-[#E67E22] text-sm font-medium border border-[#E67E22] cursor-pointer hover:bg-orange-50 transition-colors"
          >
            <Video className="w-4 h-4" />
            Livestream Categories
          </button>
        )}

        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2 rounded-sm bg-[#E67E22] text-white text-sm font-medium border-none cursor-pointer hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Category
        </button>
      </div>
    </div>
  );
};
