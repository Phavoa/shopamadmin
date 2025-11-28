import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useUploadFileMutation } from "@/api/filesApi";

interface FileUploadProps {
  previewUrl: string | null;
  selectedFile: File | null;
  uploadedImageUrl: string | null;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isDisabled?: boolean;
  onUploadSuccess: (url: string) => void;
  onUploadError: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  previewUrl,
  selectedFile,
  uploadedImageUrl,
  onFileSelect,
  onRemoveFile,
  fileInputRef,
  isDisabled = false,
  onUploadSuccess,
  onUploadError,
}) => {
  const [uploadFile] = useUploadFileMutation();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // First, show the preview
    onFileSelect(file);

    // Then immediately upload the file
    try {
      setIsUploading(true);
      console.log("🖼️  Uploading file immediately...", file.name);

      const uploadResult = await uploadFile({
        file,
        prefix: "categories",
      }).unwrap();

      const imageUrl = uploadResult.data.url;
      console.log("✅ File uploaded successfully:", imageUrl);

      onUploadSuccess(imageUrl);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } })?.data?.message
          : "Failed to upload image";

      console.error("Upload error:", error);
      onUploadError(errorMessage);

      // Clean up the selected file on error
      onRemoveFile();
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    onRemoveFile();
    // Also clear the uploaded URL when file is removed
    onUploadSuccess(""); // This will be handled by parent component
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isDisabled || isUploading}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isDisabled || isUploading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Upload className="w-4 h-4" />
        {isUploading
          ? "Uploading..."
          : selectedFile
          ? "Change Image"
          : "Choose Image"}
      </button>

      {(previewUrl || uploadedImageUrl) && (
        <div className="relative">
          <Image
            src={previewUrl || uploadedImageUrl || ""}
            alt="Preview"
            width={400}
            height={128}
            className="w-full h-32 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            disabled={isDisabled || isUploading}
          >
            <X className="w-3 h-3" />
          </button>
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white text-sm font-medium">Uploading...</div>
            </div>
          )}
        </div>
      )}

      {uploadedImageUrl && (
        <p className="text-xs text-green-600">✅ Image uploaded successfully</p>
      )}

      {isUploading && (
        <p className="text-xs text-blue-600">📤 Uploading image to server...</p>
      )}

      <p className="text-xs text-gray-500">
        Supported formats: JPG, PNG, GIF (Max 5MB)
      </p>
    </div>
  );
};
