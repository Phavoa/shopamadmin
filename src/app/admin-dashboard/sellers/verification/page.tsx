/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import {
  approveSeller,
  suspendSeller,
  getSellers,
  SellerProfileVM,
} from "@/api/sellerApi";
import { useNotifications } from "@/hooks/useNotifications";
import {
  VerificationPageHeader,
  SellerTable,
  SellerDetails,
  ApproveModal,
  RejectModal,
  DocumentPreviewModal,
  DisplaySeller,
} from "@/components/sellers/verification";

const Page = () => {
  const [sellers, setSellers] = useState<DisplaySeller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<DisplaySeller | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [fetchingSellers, setFetchingSellers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setFetchingSellers(true);
        setError(null);

        const response = await getSellers({
          limit: 50,
          populate: "user",
        });

        setSellers(response.data.items);
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
        setError("Failed to load sellers. Please try again.");
      } finally {
        setFetchingSellers(false);
      }
    };

    fetchSellers();
  }, []);

  const handleApprove = async () => {
    if (!selectedSeller) return;

    setLoading(true);
    try {
      await approveSeller(selectedSeller.userId);

      setSellers((prev) =>
        prev.map((seller) =>
          seller.userId === selectedSeller.userId
            ? { ...seller, status: "ACTIVE" }
            : seller
        )
      );

      setShowApproveModal(false);
      setSelectedSeller(null);
    } catch (error) {
      console.error("Failed to approve seller:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSeller) return;

    setLoading(true);
    try {
      await suspendSeller(selectedSeller.userId);

      setSellers((prev) =>
        prev.map((seller) =>
          seller.userId === selectedSeller.userId
            ? { ...seller, status: "SUSPENDED" }
            : seller
        )
      );

      setShowRejectModal(false);
      setSelectedSeller(null);
    } catch (error) {
      console.error("Failed to reject seller:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDocumentModal = (url: string, title: string) => {
    setSelectedDocument({ url, title });
    setShowDocumentModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <VerificationPageHeader />

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7">
            <SellerTable
              sellers={sellers}
              fetchingSellers={fetchingSellers}
              error={error}
              selectedSeller={selectedSeller}
              onSellerSelect={setSelectedSeller}
            />
          </div>

          <div className="col-span-5">
            <SellerDetails
              selectedSeller={selectedSeller}
              loading={loading}
              onDocumentClick={openDocumentModal}
              onApprove={() => setShowApproveModal(true)}
              onReject={() => setShowRejectModal(true)}
            />
          </div>
        </div>
      </div>

      <ApproveModal
        show={showApproveModal}
        seller={selectedSeller}
        loading={loading}
        onClose={() => setShowApproveModal(false)}
        onApprove={handleApprove}
      />

      <RejectModal
        show={showRejectModal}
        seller={selectedSeller}
        loading={loading}
        onClose={() => setShowRejectModal(false)}
        onReject={handleReject}
      />

      <DocumentPreviewModal
        show={showDocumentModal}
        document={selectedDocument}
        onClose={() => setShowDocumentModal(false)}
      />
    </div>
  );
};

export default Page;
