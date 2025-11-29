import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SellersFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const SellersFilters: React.FC<SellersFiltersProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search sellers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default SellersFilters;
