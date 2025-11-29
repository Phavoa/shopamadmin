"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface BuyerErrorStateProps {
  onRetry: () => void;
}

const BuyerErrorState: React.FC<BuyerErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 mb-4">
          Failed to load buyers. Please try again.
        </p>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    </div>
  );
};

export default BuyerErrorState;
