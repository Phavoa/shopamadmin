"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import FiltersBar from "@/components/slots/FiltersBar";
import CalendarBoard from "@/components/slots/CalendarBoard";
import SlotDetailsPanel from "@/components/slots/SlotDetailsPanel";
import SlotModal from "@/components/slots/SlotModal";
import {
  mockSlots,
  mockSellers,
  timeSlots,
  Slot,
  Seller,
} from "@/lib/mockData";

const Page = () => {
  const [slots, setSlots] = useState<Slot[]>(mockSlots);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRange, setSelectedRange] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);

  // Filter slots based on search and filters
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      const matchesSearch =
        searchQuery === "" ||
        slot.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (slot.product &&
          slot.product.toLowerCase().includes(searchQuery.toLowerCase()));

      // Time range filter
      const slotDate = new Date(slot.date);
      const now = new Date();
      let matchesRange = true;

      if (selectedRange !== "all") {
        switch (selectedRange) {
          case "hour":
            matchesRange = slotDate >= new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case "day":
            matchesRange = slotDate.toDateString() === now.toDateString();
            break;
          case "week":
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            matchesRange = slotDate >= weekStart && slotDate <= weekEnd;
            break;
          case "month":
            matchesRange =
              slotDate.getMonth() === now.getMonth() &&
              slotDate.getFullYear() === now.getFullYear();
            break;
          case "year":
            matchesRange = slotDate.getFullYear() === now.getFullYear();
            break;
        }
      }

      const matchesTier = selectedTier === "all" || slot.tier === selectedTier;
      const matchesCategory =
        selectedCategory === "all" || slot.category === selectedCategory;
      const matchesCity = selectedCity === "all" || slot.city === selectedCity;
      const matchesStatus =
        selectedStatus === "all" || slot.status === selectedStatus;

      return (
        matchesSearch &&
        matchesRange &&
        matchesTier &&
        matchesCategory &&
        matchesCity &&
        matchesStatus
      );
    });
  }, [
    slots,
    searchQuery,
    selectedRange,
    selectedTier,
    selectedCategory,
    selectedCity,
    selectedStatus,
  ]);

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

  const handleCreateSlot = () => {
    setEditingSlot(null);
    setIsModalOpen(true);
  };

  const handleEditSlot = (slot: Slot) => {
    setEditingSlot(slot);
    setIsModalOpen(true);
  };

  const handleDeleteSlot = (slotId: string) => {
    setSlots(slots.filter((slot) => slot.id !== slotId));
    if (selectedSlot?.id === slotId) {
      setSelectedSlot(null);
    }
  };

  const handleSaveSlot = (slotData: Partial<Slot>) => {
    if (editingSlot) {
      // Update existing slot
      setSlots(
        slots.map((slot) =>
          slot.id === editingSlot.id ? { ...slot, ...slotData } : slot
        )
      );
    } else {
      // Create new slot
      const newSlot: Slot = {
        id: Date.now().toString(),
        sellerId: slotData.sellerId || "",
        sellerName: slotData.sellerName || "",
        startTime: slotData.startTime || selectedTime,
        endTime: slotData.endTime || "",
        status: slotData.status as "booked" | "available",
        date: new Date().toISOString().split("T")[0],
        duration: slotData.duration || 60,
        product: slotData.product,
        price: slotData.price,
        tier: slotData.tier,
        category: slotData.category,
        city: slotData.city,
      };
      setSlots([...slots, newSlot]);
    }
    setIsModalOpen(false);
    setEditingSlot(null);
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
              />

              {/* Main Content Grid */}
              <div className="mt-6 flex-1 gap-6">
                {/* Calendar Board */}
                <CalendarBoard
                  slots={filteredSlots}
                  timeSlots={timeSlots}
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
