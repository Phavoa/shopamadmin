// src/components/logistics/InvestigateExceptionModal.tsx

import { X, Package, AlertTriangle, Eye, Copy, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  useRequestMoreEvidenceMutation,
  useResolveExceptionMutation,
} from "@/api/orderExceptionsApi";
import RequestMoreEvidenceModal from "./RequestMoreEvidenceModal";
import { useNotifications } from "@/hooks/useNotifications";

interface InvestigateExceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  exception: {
    id: string;
    orderId: string;
    type: string;
    status: string;
    description: string;
    images?: string[];
    createdAt: string;
    updatedAt: string;
    buyer?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    };
    seller?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    };
  } | null;
}

export default function InvestigateExceptionModal({
  isOpen,
  onClose,
  exception,
}: InvestigateExceptionModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [showRequestEvidenceModal, setShowRequestEvidenceModal] =
    useState(false);

  const [requestMoreEvidence, { isLoading: isRequestingEvidence }] =
    useRequestMoreEvidenceMutation();
  const [resolveException, { isLoading: isResolvingException }] =
    useResolveExceptionMutation();
  const { showSuccess, showError } = useNotifications();

  // Auto-hide copy feedback
  useEffect(() => {
    if (copiedPhone) {
      const timer = setTimeout(() => {
        setCopiedPhone(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedPhone]);

  // Keyboard navigation for image viewer
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (selectedImageIndex !== null && exception?.images) {
        switch (event.key) {
          case "Escape":
            closeImageViewer();
            break;
          case "ArrowLeft":
            prevImage();
            break;
          case "ArrowRight":
            nextImage();
            break;
        }
      }
    };

    if (selectedImageIndex !== null) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [selectedImageIndex, exception?.images]);

  if (!isOpen || !exception) return null;

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageViewer = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null && exception.images) {
      setSelectedImageIndex((selectedImageIndex + 1) % exception.images.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && exception.images) {
      setSelectedImageIndex(
        selectedImageIndex === 0
          ? exception.images.length - 1
          : selectedImageIndex - 1
      );
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPhone(label);
      setTimeout(() => setCopiedPhone(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedPhone(label);
        setTimeout(() => setCopiedPhone(null), 2000);
      } catch (err) {
        console.error("Fallback copy failed: ", err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleContactBuyer = () => {
    if (exception.buyer?.phone) {
      copyToClipboard(exception.buyer.phone, "Buyer");
    }
  };

  const handleContactSeller = () => {
    if (exception.seller?.phone) {
      copyToClipboard(exception.seller.phone, "Seller");
    }
  };

  const handleRequestMoreEvidence = () => {
    setShowRequestEvidenceModal(true);
  };

  const handleRequestEvidenceSubmit = async (orderId: string, note: string) => {
    try {
      await requestMoreEvidence({
        orderId: exception.orderId,
        exId: exception.id,
        data: { note },
      }).unwrap();
      setShowRequestEvidenceModal(false);
      showSuccess("Evidence request sent successfully");
    } catch (error) {
      console.error("Failed to request more evidence:", error);
      showError("Failed to request more evidence");
    }
  };

  const handleApproveRefund = async () => {
    try {
      await resolveException({
        orderId: exception.orderId,
        exId: exception.id,
        data: { status: "RESOLVED" },
      }).unwrap();
      showSuccess("Refund approved successfully");
      onClose();
    } catch (error) {
      console.error("Failed to approve refund:", error);
      showError("Failed to approve refund");
    }
  };

  const handleCloseException = async () => {
    try {
      await resolveException({
        orderId: exception.orderId,
        exId: exception.id,
        data: { status: "REJECTED" },
      }).unwrap();
      showSuccess("Exception closed successfully");
      onClose();
    } catch (error) {
      console.error("Failed to close exception:", error);
      showError("Failed to close exception");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-[3px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-semibold">
            Investigate Exception - Order {exception.orderId}
          </h2>
        </div>

        {/* Order Details */}
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          <span className="font-semibold">Order & Buyer Details</span>
        </div>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Exception ID:</span> {exception.id}
            </p>
            <p>
              <span className="font-medium">Order ID:</span> {exception.orderId}
            </p>
            <p>
              <span className="font-medium">Buyer:</span>{" "}
              {exception.buyer?.firstName && exception.buyer?.lastName
                ? `${exception.buyer.firstName} ${exception.buyer.lastName}`
                : exception.buyer?.email || "Unknown Buyer"}{" "}
              {exception.buyer?.phone && `(📱${exception.buyer.phone})`}
            </p>
            <p>
              <span className="font-medium">Seller:</span>{" "}
              {exception.seller?.firstName && exception.seller?.lastName
                ? `${exception.seller.firstName} ${exception.seller.lastName}`
                : exception.seller?.email || "Unknown Seller"}{" "}
              {exception.seller?.phone && `(📱${exception.seller.phone})`}
            </p>
            <p>
              <span className="font-medium">Status:</span> {exception.status}
            </p>
            <p>
              <span className="font-medium">Created:</span>{" "}
              {new Date(exception.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Reported Issue */}
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span className="font-semibold">Reported Issue</span>
        </div>
        <div className="mb-6 p-4 bg-red-50 rounded-lg">
          <div className="text-sm space-y-2">
            <p>
              <span className="font-medium">Reported by:</span>{" "}
              {exception.buyer?.firstName && exception.buyer?.lastName
                ? `${exception.buyer.firstName} ${exception.buyer.lastName}`
                : exception.buyer?.email || "Buyer"}
            </p>
            <p>
              <span className="font-medium">Reason:</span> {exception.type}
            </p>
            <p>
              <span className="font-medium">Buyer Note:</span>{" "}
              {exception.description}
            </p>
            {exception.images && exception.images.length > 0 && (
              <div>
                <p className="font-medium mb-2">Photos:</p>
                <div className="grid grid-cols-4 gap-2">
                  {exception.images.map((image, index) => (
                    <div
                      key={index}
                      className="h-24 relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors"
                      onClick={() => openImageViewer(index)}
                    >
                      <Image
                        src={image}
                        alt={`Evidence ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/image-placeholder.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Staff Actions */}
        <div>
          <h3 className="font-semibold mb-3">Staff Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
              onClick={handleContactBuyer}
              disabled={!exception.buyer?.phone}
              title={
                exception.buyer?.phone
                  ? `Copy ${exception.buyer.phone}`
                  : "No phone number available"
              }
            >
              <Phone className="w-4 h-4" />
              {copiedPhone === "Buyer" ? "Copied!" : "Contact Buyer"}
              {exception.buyer?.phone && !copiedPhone && (
                <Copy className="w-3 h-3" />
              )}
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
              onClick={handleContactSeller}
              disabled={!exception.seller?.phone}
              title={
                exception.seller?.phone
                  ? `Copy ${exception.seller.phone}`
                  : "No phone number available"
              }
            >
              <Phone className="w-4 h-4" />
              {copiedPhone === "Seller" ? "Copied!" : "Contact Seller"}
              {exception.seller?.phone && !copiedPhone && (
                <Copy className="w-3 h-3" />
              )}
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleRequestMoreEvidence}
            >
              Request More Evidence
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={handleApproveRefund}
              disabled={isResolvingException}
            >
              {isResolvingException ? "Processing..." : "Approve Refund"}
            </Button>
            <Button className="bg-green-500 hover:bg-green-600" disabled>
              Send Replacement
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={handleCloseException}
              disabled={isResolvingException}
            >
              {isResolvingException ? "Processing..." : "Close"}
            </Button>
          </div>
        </div>

        {/* Image Viewer Modal */}
        {selectedImageIndex !== null && exception.images && (
          <div
            className="fixed inset-0 flex items-center justify-center z-60"
            onClick={closeImageViewer}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeImageViewer}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <X className="w-8 h-8" />
              </button>

              <Image
                src={exception.images[selectedImageIndex]}
                alt={`Evidence ${selectedImageIndex + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/image-placeholder.png";
                }}
              />

              {exception.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 rounded-full p-2"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 rounded-full p-2"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} of {exception.images.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Request More Evidence Modal */}
        <RequestMoreEvidenceModal
          isOpen={showRequestEvidenceModal}
          onClose={() => setShowRequestEvidenceModal(false)}
          exceptionId={exception.id}
          orderId={exception.orderId}
          onSubmit={handleRequestEvidenceSubmit}
          isLoading={isRequestingEvidence}
        />
      </div>
    </div>
  );
}
