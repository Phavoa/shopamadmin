import { useRef, useState } from "react";
import { Upload, X, AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useUploadFileMutation } from "@/api/filesApi";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

interface FileUploadProps {
  previewUrl: string | null;
  selectedFile: File | null;
  uploadedImageUrl: string | null;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  /** @deprecated No longer used — FileUpload manages its own internal ref */
  fileInputRef?: React.RefObject<HTMLInputElement>;
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
  isDisabled = false,
  onUploadSuccess,
  onUploadError,
}) => {
  const [uploadFile] = useUploadFileMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Each FileUpload instance owns its own input ref — no more shared ref
  const internalRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error state
    setUploadError(null);

    // --- Client-side validation ---
    if (!ALLOWED_TYPES.includes(file.type)) {
      const msg = `Unsupported file type "${file.type}". Please use JPG, PNG, GIF, or WebP.`;
      setUploadError(msg);
      onUploadError(msg);
      // Reset the input so the same file can be reselected after fixing
      if (internalRef.current) internalRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const msg = `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`;
      setUploadError(msg);
      onUploadError(msg);
      if (internalRef.current) internalRef.current.value = "";
      return;
    }

    // Show preview immediately
    onFileSelect(file);

    // Upload to server
    try {
      setIsUploading(true);
      console.log(
        "🖼️  Uploading file:",
        file.name,
        `(${(file.size / 1024).toFixed(0)} KB)`,
      );

      const uploadResult = await uploadFile({
        file,
        prefix: "categories",
      }).unwrap();

      const imageUrl = uploadResult.data.url;
      console.log("✅ Upload success:", imageUrl);

      onUploadSuccess(imageUrl);
      setUploadError(null);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } })?.data?.message ||
            "Server rejected the upload. Please try again."
          : "Upload failed — check your connection and try again.";

      console.error("❌ Upload error:", error);
      setUploadError(errorMessage);
      onUploadError(errorMessage);

      // Remove the local preview since the upload failed
      onRemoveFile();
    } finally {
      setIsUploading(false);
      // Always reset the input value so the same file can be retried
      if (internalRef.current) internalRef.current.value = "";
    }
  };

  const handleRemoveFile = () => {
    setUploadError(null);
    onRemoveFile();
    // Notify parent that there is no longer an uploaded URL
    // We use a dedicated null signal — NOT onUploadSuccess("") to avoid false-positive state
    onUploadSuccess("__REMOVED__");
    if (internalRef.current) internalRef.current.value = "";
  };

  const isUploadedSuccessfully =
    !!uploadedImageUrl && uploadedImageUrl !== "__REMOVED__";

  return (
    <div className="space-y-3">
      <input
        ref={internalRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isDisabled || isUploading}
      />

      <button
        type="button"
        onClick={() => internalRef.current?.click()}
        disabled={isDisabled || isUploading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
      >
        <Upload className="w-4 h-4" />
        {isUploading
          ? "Uploading…"
          : selectedFile
            ? "Change Image"
            : "Choose Image"}
      </button>

      {/* Preview */}
      {(previewUrl || uploadedImageUrl) &&
        uploadedImageUrl !== "__REMOVED__" && (
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
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              disabled={isDisabled || isUploading}
            >
              <X className="w-3 h-3" />
            </button>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="text-white text-sm font-medium flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading…
                </div>
              </div>
            )}
          </div>
        )}

      {/* Status indicators */}
      {isUploadedSuccessfully && !isUploading && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Image uploaded successfully
        </p>
      )}

      {uploadError && (
        <p className="text-xs text-red-600 flex items-center gap-1 bg-red-50 border border-red-200 rounded px-2 py-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {uploadError}
        </p>
      )}

      <p className="text-xs text-gray-500">
        Supported: JPG, PNG, GIF, WebP · Max {MAX_FILE_SIZE_MB}MB
      </p>
    </div>
  );
};
