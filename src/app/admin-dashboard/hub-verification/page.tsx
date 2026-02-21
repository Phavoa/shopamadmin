"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import {
  AnimatedWrapper,
  PageWrapper,
} from "@/components/shared/AnimatedWrapper";
import HubVerificationTable from "@/components/hubs/HubVerificationTable";
import HubVerificationDetails from "@/components/hubs/HubVerificationDetails";
import { HubDisplay } from "@/components/hubs/types";
import { useGetHubsQuery, useReviewHubMutation } from "@/api/hubApi";
import { toast } from "sonner";

const Page = () => {
  const dispatch = useDispatch();

  // State
  const [selectedHub, setSelectedHub] = useState<HubDisplay | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hubs, setHubs] = useState<HubDisplay[]>([]);

  // Fetch hubs (using API but mocking missing fields)
  const { data: hubsData, isLoading, error } = useGetHubsQuery({});
  const [reviewHub] = useReviewHubMutation();

  useEffect(() => {
    dispatch(setHeaderTitle("Hub Document Verification"));
  }, [dispatch]);

  useEffect(() => {
    if (hubsData?.data?.items) {
      const mappedHubs: HubDisplay[] = hubsData.data.items.map((hub) => {
        // Normalize API status to our UI status type; fall back to PENDING
        const rawStatus = (hub.status ?? "PENDING").toUpperCase();
        const status: HubDisplay["status"] =
          rawStatus === "APPROVED"
            ? "APPROVED"
            : rawStatus === "REJECTED" || rawStatus === "DENIED"
              ? "REJECTED"
              : "PENDING";

        return {
          ...hub,
          status,
          documents: [
            { title: "Personal ID", url: hub.idCardUrl || "", type: "image" },
            {
              title: "Photo holding ID",
              url: hub.selfieWithIdUrl || "",
              type: "image",
            },
            {
              title: "Utility Bill",
              url: hub.proofOfAddressUrl || "",
              type: "image",
            },
          ],
          submittedAt: hub.createdAt,
        };
      });
      setHubs(mappedHubs);
    }
  }, [hubsData]);

  const handleHubSelect = (hub: HubDisplay) => {
    setSelectedHub(hub);
  };

  const handleApprove = async () => {
    if (!selectedHub) return;
    setIsProcessing(true);

    try {
      await reviewHub({
        id: selectedHub.id,
        action: "APPROVE",
        reason: "Approved by admin",
      }).unwrap();
      toast.success(`Hub "${selectedHub.name}" approved successfully`);
      setSelectedHub(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve hub");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedHub) return;
    setIsProcessing(true);

    try {
      await reviewHub({
        id: selectedHub.id,
        action: "REJECT",
        reason: "Rejected by admin",
      }).unwrap();
      toast.error(`Hub "${selectedHub.name}" rejected`);
      setSelectedHub(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject hub");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageWrapper className="min-h-screen px-6 py-8">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <AnimatedWrapper animation="fadeIn" delay={0.1}>
            <HubVerificationTable
              hubs={hubs}
              isLoading={isLoading}
              error={error ? "Failed to load hubs" : null}
              selectedHub={selectedHub}
              onHubSelect={handleHubSelect}
            />
          </AnimatedWrapper>
        </div>

        <div className="col-span-5">
          <AnimatedWrapper animation="slideLeft" delay={0.2}>
            <HubVerificationDetails
              selectedHub={selectedHub}
              onApprove={handleApprove}
              onReject={handleReject}
              isProcessing={isProcessing}
            />
          </AnimatedWrapper>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Page;
