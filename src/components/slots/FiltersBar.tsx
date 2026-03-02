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
  categories?: { id: string; name: string }[];
  states?: { state: string; alias: string }[];
  tiers?: { id: string; name: string }[];
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
  categories = [],
  states = [],
  tiers = [],
}) => {
  return (
    <div className=" border border-gray-200 rounded-[12px] p-4 mb-6 ">
      <h1 className="text-xl font-semibold mb-4">Filters</h1>
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
            {tiers.map((tier) => (
              <SelectItem key={tier.id} value={tier.id}>
                {tier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[160px] border-[#E6E9EB]  py-6">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCity} onValueChange={onCityChange}>
          <SelectTrigger className="w-[160px] border-[#E6E9EB]  py-6">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {states.map((state) => (
              <SelectItem key={state.state} value={state.alias.toLowerCase()}>
                {state.alias}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[160px] border-[#E6E9EB]  py-6">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="LIVE">Live</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ENDED">Ended</SelectItem>
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
