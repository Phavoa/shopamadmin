import React from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { DisplaySeller } from "./verification-utils";

interface ApproveModalProps {
  show: boolean;
  seller: DisplaySeller | null;
  loading: boolean;
  onClose: () => void;
  onApprove: () => void;
}

const ApproveModal: React.FC<ApproveModalProps> = ({
  show,
  seller,
  loading,
  onClose,
  onApprove,
}) => {
  if (!show || !seller) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[3px] flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
        style={{ borderRadius: "18px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-black">Approve Seller</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-700 mb-6">
          Are you sure you want to approve <strong>{seller.shopName}</strong>?
          They will gain full access to sell on the platform.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onApprove}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Approving...
              </>
            ) : (
              "Approve"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveModal;
