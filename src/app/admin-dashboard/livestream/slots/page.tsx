"use client";

import React, { useState, useMemo, useEffect } from "react";
import FiltersBar from "@/components/slots/FiltersBar";
import CalendarBoard from "@/components/slots/CalendarBoard";
import SlotDetailsPanel from "@/components/slots/SlotDetailsPanel";
import { Slot } from "@/lib/mockData";
import {
  useGetLiveStreamsQuery,
  LiveStream,
  GetLiveStreamsParams,
} from "@/api/liveStreamApi";
import { useGetLivestreamTiersQuery } from "@/api/slotApi";
import { useGetCategoriesQuery } from "@/api/categoriesApi";
import { useGetStatesQuery } from "@/api/userApi";

// Adapter function to transform API response to UI Slot model
const mapLiveStreamToSlot = (stream: LiveStream): Slot => {
  // Debug log to inspect actual response structure

  const startDate = new Date(stream.scheduledStartAt);
  const endDate = new Date(stream.scheduledEndAt);

  // Format date as YYYY-MM-DD
  const dateStr = startDate.toISOString().split("T")[0];

  // Format times as HH:mm
  const startTimeStr = startDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const endTimeStr = endDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Calculate duration in minutes
  const durationMinutes = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60),
  );

  // Map tier name to expected union type
  // Map tier name to expected union type
  // Enforcing strict tiers: Beginner, Bronze, Gold, Pop-Up
  let tierValue: "Beginner" | "Bronze" | "Gold" | "Pop-Up" = "Bronze";
  if (stream.tier?.name) {
    const nameLower = stream.tier.name.toLowerCase();
    if (nameLower.includes("gold")) tierValue = "Gold";
    else if (nameLower.includes("beginner")) tierValue = "Beginner";
    else if (nameLower.includes("bronze")) tierValue = "Bronze";
    else if (nameLower.includes("pop")) tierValue = "Pop-Up";
  }

  // Calculate generic price from items (if available) or default
  // Use the first item's title as the main product name if available
  const mainProduct = stream.items?.[0]?.title || stream.title || "No Product";

  const estimatedPrice = stream.items?.reduce((acc, item) => {
    return acc + (parseFloat(item.startingPrice) || 0);
  }, 0);

  // Attempt to find seller data in likely fields if 'seller' is missing
  // Casting to any to check for 'user' or 'host' fields that might be returned
  const sellerData =
    stream.seller || (stream as any).user || (stream as any).host;

  // Map status: SCHEDULED -> DRAFT for UI
  const uiStatus = stream.status === "SCHEDULED" ? "DRAFT" : stream.status;

  return {
    id: stream.id,
    sellerId: sellerData?.id || "unknown-seller",
    sellerName: sellerData
      ? `${sellerData.firstName} ${sellerData.lastName}`
      : "Unknown Seller",
    startTime: startTimeStr,
    endTime: endTimeStr,
    status: "booked", // API returns scheduled/live streams, which are effectively "booked" slots
    date: dateStr,
    duration: durationMinutes,
    product: mainProduct,
    price: estimatedPrice || 0,
    tier: tierValue as any,
    category: stream.categoryIds?.[0] || "General",
    city: "Online", // Placeholder
    livestreamStatus: uiStatus,
    itemsCount: stream.items?.length || 0,
    tierCap: stream.tier?.maxViewers || 0,
    realDuration: durationMinutes,
  };
};

const Page = () => {
  // Initialize with empty array primarily, awaiting data
  const [slots, setSlots] = useState<Slot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRange, setSelectedRange] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedTime, setSelectedTime] = useState("");

  // Fetch real data
  const { data: tiersData } = useGetLivestreamTiersQuery({});

  const queryParams = useMemo(() => {
    const params: GetLiveStreamsParams = {
      limit: 100,
      populate: ["seller", "seller.user", "tier", "items"],
    };

    if (searchQuery) params.q = searchQuery;

    if (selectedStatus !== "all") {
      // Map UI "DRAFT" to API "SCHEDULED"
      params.status = selectedStatus === "DRAFT" ? "SCHEDULED" : selectedStatus;
    }
    if (selectedCategory !== "all") params.categoryIds = [selectedCategory];
    if (selectedTier !== "all") params.tier = selectedTier;

    const now = new Date();
    if (selectedRange !== "all") {
      if (selectedRange === "hour") {
        params.scheduledStartFrom = new Date(
          now.getTime() - 60 * 60 * 1000,
        ).toISOString();
      } else if (selectedRange === "day") {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        params.scheduledStartFrom = start.toISOString();
        params.scheduledStartTo = end.toISOString();
      } else if (selectedRange === "week") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        params.scheduledStartFrom = weekStart.toISOString();
        params.scheduledStartTo = weekEnd.toISOString();
      } else if (selectedRange === "month") {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );
        params.scheduledStartFrom = monthStart.toISOString();
        params.scheduledStartTo = monthEnd.toISOString();
      } else if (selectedRange === "year") {
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        params.scheduledStartFrom = yearStart.toISOString();
        params.scheduledStartTo = yearEnd.toISOString();
      }
    }
    return params;
  }, [
    searchQuery,
    selectedStatus,
    selectedCategory,
    selectedTier,
    selectedRange,
  ]);

  const { data: liveStreamsData } = useGetLiveStreamsQuery(queryParams);

  const { data: categoriesData } = useGetCategoriesQuery({ limit: 100 });
  const { data: statesData } = useGetStatesQuery();

  // Sync API data to local state
  useEffect(() => {
    if (liveStreamsData?.data?.items) {
      const mappedSlots = liveStreamsData.data.items.map(mapLiveStreamToSlot);
      setSlots(mappedSlots);
    } else {
      setSlots([]);
    }
  }, [liveStreamsData]);

  // Filter slots - logic moved to backend
  const filteredSlots = useMemo(() => {
    return slots;
  }, [slots]);

  const handleSlotClick = (slot: Slot | null, time: string) => {
    setSelectedSlot(slot);
    setSelectedTime(time);
  };

  const handleApplyFilters = () => {
    // Filters are applied automatically through useMemo
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedRange("all");
    setSelectedTier("all");
    setSelectedCategory("all");
    setSelectedCity("all");
    setSelectedStatus("all");
  };

  const handleEditSlot = (slot: Slot) => {
    console.log("Edit slot:", slot.id);
    // Modal logic removed or needs to be adapted if modal is removed
  };

  const handleDeleteSlot = (slotId: string) => {
    setSlots(slots.filter((slot) => slot.id !== slotId));
    if (selectedSlot?.id === slotId) {
      setSelectedSlot(null);
    }
  };

  return (
    <div className="flex-1 space-y-6 py-10">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div>
            <div className="px-6 pb-6">
              {/* Filters Bar */}
              <FiltersBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedRange={selectedRange}
                onRangeChange={setSelectedRange}
                selectedTier={selectedTier}
                onTierChange={setSelectedTier}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                categories={categoriesData?.data?.items}
                states={statesData?.states}
                tiers={tiersData?.data?.items}
              />

              {/* Main Content Grid */}
              <div className="mt-6 flex-1 gap-6">
                {/* Calendar Board */}
                <CalendarBoard
                  slots={filteredSlots}
                  onSlotClick={handleSlotClick}
                />

                {/* Slot Details Panel */}
                <div className="mt-6">
                  <SlotDetailsPanel
                    selectedSlot={selectedSlot}
                    selectedTime={selectedTime}
                    onClose={() => setSelectedSlot(null)}
                    onEdit={handleEditSlot}
                    onDelete={handleDeleteSlot}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
