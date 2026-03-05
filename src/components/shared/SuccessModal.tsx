import React from "react";
import { X, CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center z-[100] transition-all duration-300"
      onClick={onClose}
    >
      <div
        style={{
          width: "400px",
          padding: "32px",
          borderRadius: "24px",
          background: "#FFF",
          boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.1)",
        }}
        className="transform scale-100 animate-in fade-in zoom-in duration-300 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-green-100 rounded-full scale-150 blur-xl opacity-50" />
          <CheckCircle2 className="w-16 h-16 text-green-500 relative z-10 animate-bounce" />
        </div>

        <h2 className="text-2xl font-bold text-black mb-2">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            background: "#10B981",
            color: "#FFF",
            fontSize: "16px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          className="hover:bg-green-600 hover:shadow-lg active:scale-95"
        >
          Great, thanks!
        </button>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};
