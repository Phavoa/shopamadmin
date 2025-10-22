"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRange: string;
  onRangeChange: (range: string) => void;
  selectedTier: string;
  onTierChange: (tier: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedRange,
  onRangeChange,
  selectedTier,
  onTierChange,
  selectedCategory,
  onCategoryChange,
  selectedCity,
  onCityChange,
  selectedStatus,
  onStatusChange,
  onApplyFilters,
  onClearFilters,
}) => {
  return (
    <div className=" border border-gray-200 rounded-[12px] p-4 mb-6 ">
      <h1 className="text-xl font-semibold mb-4">Fliters</h1>
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={selectedRange} onValueChange={onRangeChange}>
          <SelectTrigger className="w-[160px] border-[#E6E9EB]  py-6">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent className="text-gray-700">
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="hour">Last Hour</SelectItem>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedTier} onValueChange={onTierChange}>
          <SelectTrigger className="w-[160px] border-[#E6E9EB]  py-6">
            <SelectValue placeholder="Select Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="gold">Gold</SelectItem>
            <SelectItem value="silver">Silver</SelectItem>
            <SelectItem value="bronze">Bronze</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[160px] border-[#E6E9EB]  py-6">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="home">Home & Garden</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCity} onValueChange={onCityChange}>
          <SelectTrigger className="w-[160px] border-[#E6E9EB]  py-6">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            <SelectItem value="lagos">Lagos</SelectItem>
            <SelectItem value="abuja">Abuja</SelectItem>
            <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[160px] border-[#E6E9EB]  py-6">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="available">Available</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={onApplyFilters}
          className="bg-[#E8772D] hover:bg-[#DD6F28] text-white  px-5 rounded-sm font-semibold"
        >
          Apply Filters
        </Button>

        <button
          onClick={onClearFilters}
          className="text-[#00A86B] text-[14px] font-medium hover:underline ml-2"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FiltersBar;
