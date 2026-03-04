import React from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { FileUpload } from "@/components/categories/FileUpload";
import { type LivestreamCategory } from "@/api/livestreamCategoriesApi";

interface EditLivestreamCategoryModalProps {
  isOpen: boolean;
  category: LivestreamCategory | null;
  categoryName: string;
  categoryDescription: string;
  selectedFile: File | null;
  previewUrl: string | null;
  uploadedImageUrl: string | null;
  isUpdating: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onClose: () => void;
  onCategoryNameChange: (name: string) => void;
  onCategoryDescriptionChange: (desc: string) => void;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  onRemoveCurrentImage: () => void;
  onUploadSuccess: (url: string) => void;
  onUploadError: (error: string) => void;
  onSubmit: () => void;
}

export const EditLivestreamCategoryModal: React.FC<
  EditLivestreamCategoryModalProps
> = ({
  isOpen,
  category,
  categoryName,
  categoryDescription,
  selectedFile,
  previewUrl,
  uploadedImageUrl,
  isUpdating,
  fileInputRef,
  onClose,
  onCategoryNameChange,
  onCategoryDescriptionChange,
  onFileSelect,
  onRemoveFile,
  onRemoveCurrentImage,
  onUploadSuccess,
  onUploadError,
  onSubmit,
}) => {
  if (!isOpen || !category) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="w-[500px] bg-white rounded-xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 bg-transparent border-none cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-xl font-semibold text-black mb-6">
          Edit Livestream Category
        </h2>

        <div className="space-y-4">
          {/* Name */}
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
              disabled={isUpdating}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Description
            </label>
            <textarea
              value={categoryDescription}
              onChange={(e) => onCategoryDescriptionChange(e.target.value)}
              placeholder="Enter category description (optional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] resize-none"
              disabled={isUpdating}
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Category Image
            </label>
            <div className="space-y-3">
              <FileUpload
                previewUrl={previewUrl}
                selectedFile={selectedFile}
                uploadedImageUrl={uploadedImageUrl}
                onFileSelect={onFileSelect}
                onRemoveFile={onRemoveFile}
                fileInputRef={fileInputRef}
                isDisabled={isUpdating}
                onUploadSuccess={onUploadSuccess}
                onUploadError={onUploadError}
              />

              {!selectedFile && !previewUrl && category?.image && (
                <div className="relative">
                  <Image
                    src={category.image}
                    alt="Current"
                    width={400}
                    height={128}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={onRemoveCurrentImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    disabled={isUpdating}
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Current image (click X to remove)
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onSubmit}
            disabled={isUpdating || !categoryName.trim()}
            className="w-full py-3 px-5 rounded-lg bg-[#E67E22] text-white text-sm font-medium border-none cursor-pointer hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
