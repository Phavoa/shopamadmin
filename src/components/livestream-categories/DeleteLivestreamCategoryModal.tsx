import React from "react";
import { X } from "lucide-react";
import { type LivestreamCategory } from "@/api/livestreamCategoriesApi";

interface DeleteLivestreamCategoryModalProps {
  isOpen: boolean;
  category: LivestreamCategory | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export const DeleteLivestreamCategoryModal: React.FC<
  DeleteLivestreamCategoryModalProps
> = ({ isOpen, category, isDeleting, onClose, onConfirmDelete }) => {
  if (!isOpen || !category) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="w-[400px] bg-white rounded-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 bg-transparent border-none cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-xl font-semibold text-black mb-4">
          Delete Livestream Category
        </h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the category &quot;{category.name}
          &quot;? This action cannot be undone.
        </p>

        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-6">
          ⚠️ Categories currently used in a livestream cannot be deleted.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium border-none cursor-pointer hover:bg-gray-200 transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirmDelete}
            disabled={isDeleting}
            className="flex-1 py-2 px-4 rounded-lg bg-red-600 text-white text-sm font-medium border-none cursor-pointer hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
