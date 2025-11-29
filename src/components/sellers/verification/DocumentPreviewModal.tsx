import React from "react";
import { X } from "lucide-react";

interface Document {
  url: string;
  title: string;
}

interface DocumentPreviewModalProps {
  show: boolean;
  document: Document | null;
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  show,
  document,
  onClose,
}) => {
  if (!show || !document) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto"
        style={{ borderRadius: "18px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black">{document.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
          <img
            src={document.url}
            alt={document.title}
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
