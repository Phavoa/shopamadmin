/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { approveSeller, rejectSeller, getSellers } from "@/api/sellerApi";
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
    null,
  );
  const [loading, setLoading] = useState(false);
  const [fetchingSellers, setFetchingSellers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [prevCursor, setPrevCursor] = useState<string | undefined>();
  const [queryParams, setQueryParams] = useState({
    limit: 10,
    after: undefined as string | undefined,
    before: undefined as string | undefined,
  });
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const fetchSellerList = async (params: typeof queryParams) => {
    try {
      setFetchingSellers(true);
      setError(null);

      const response = await getSellers({
        limit: params.limit,
        after: params.after,
        before: params.before,
        populate: "user",
      });

      setSellers(response.data.items);
      setHasNext(response.data.hasNext);
      setHasPrev(response.data.hasPrev);
      setNextCursor(response.data.nextCursor);
      setPrevCursor(response.data.prevCursor);
    } catch (error) {
      console.error("Failed to fetch sellers:", error);
      setError("Failed to load sellers. Please try again.");
    } finally {
      setFetchingSellers(false);
    }
  };

  useEffect(() => {
    fetchSellerList(queryParams);
  }, [queryParams]);

  const handleNextPage = () => {
    if (hasNext && nextCursor) {
      setSelectedSeller(null);
      setCurrentPage((prev) => prev + 1);
      setQueryParams((prev) => ({
        ...prev,
        after: nextCursor,
        before: undefined,
      }));
    }
  };

  const handlePrevPage = () => {
    if (hasPrev && prevCursor) {
      setSelectedSeller(null);
      setCurrentPage((prev) => Math.max(1, prev - 1));
      setQueryParams((prev) => ({
        ...prev,
        before: prevCursor,
        after: undefined,
      }));
    }
  };

  const handleGoToFirstPage = () => {
    setSelectedSeller(null);
    setCurrentPage(1);
    setQueryParams((prev) => ({
      ...prev,
      after: undefined,
      before: undefined,
    }));
  };

  const handleApprove = async () => {
    if (!selectedSeller) return;

    setLoading(true);
    try {
      await approveSeller(selectedSeller.userId);

      setSellers((prev) =>
        prev.map((seller) =>
          seller.userId === selectedSeller.userId
            ? { ...seller, status: "ACTIVE" }
            : seller,
        ),
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
      await rejectSeller(selectedSeller.userId);

      setSellers((prev) =>
        prev.map((seller) =>
          seller.userId === selectedSeller.userId
            ? { ...seller, status: "REJECTED" }
            : seller,
        ),
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
              currentPage={currentPage}
              hasNext={hasNext}
              hasPrev={hasPrev}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              onGoToFirst={handleGoToFirstPage}
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
