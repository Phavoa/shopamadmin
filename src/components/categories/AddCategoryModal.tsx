import { X } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { type Category } from "@/api/categoriesApi";

interface AddCategoryModalProps {
  isOpen: boolean;
  categoryName: string;
  selectedFile: File | null;
  previewUrl: string | null;
  uploadedImageUrl: string | null;
  isCreating: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onClose: () => void;
  onCategoryNameChange: (name: string) => void;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  onUploadSuccess: (url: string) => void;
  onUploadError: (error: string) => void;
  onSubmit: () => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  categoryName,
  selectedFile,
  previewUrl,
  uploadedImageUrl,
  isCreating,
  fileInputRef,
  onClose,
  onCategoryNameChange,
  onFileSelect,
  onRemoveFile,
  onUploadSuccess,
  onUploadError,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="w-[500px] bg-white rounded-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 bg-transparent border-none cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-xl font-semibold text-black mb-6">
          Add Product Category
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => onCategoryNameChange(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22]"
              disabled={isCreating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Category Image
            </label>
            <FileUpload
              previewUrl={previewUrl}
              selectedFile={selectedFile}
              uploadedImageUrl={uploadedImageUrl}
              onFileSelect={onFileSelect}
              onRemoveFile={onRemoveFile}
              fileInputRef={fileInputRef}
              isDisabled={isCreating}
              onUploadSuccess={onUploadSuccess}
              onUploadError={onUploadError}
            />
          </div>

          <button
            onClick={onSubmit}
            disabled={isCreating || !categoryName.trim()}
            className="w-full py-3 px-5 rounded-lg bg-[#E67E22] text-white text-sm font-medium border-none cursor-pointer hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating Category..." : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
};
