import React from "react";
import { OrderStatistics } from "@/api/ordersApi";
import { AnimatedWrapper } from "@/components/shared/AnimatedWrapper";
import InfoItem from "./InfoItem";

interface SellerOverviewProps {
  orderStatistics: OrderStatistics | null;
  orderStatsLoading: boolean;
  orderStatsError: string | null;
  activeListingsCount: number | null | undefined;
  productsLoading: boolean;
  productsError: string | Error | null | undefined;
}

const SellerOverview: React.FC<SellerOverviewProps> = ({
  orderStatistics,
  orderStatsLoading,
  orderStatsError,
  activeListingsCount,
  productsLoading,
  productsError,
}) => {
  return (
    <AnimatedWrapper animation="fadeIn" delay={0.4}>
      <div className="px-5 md:px-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          Overview
        </h2>
        <div className="space-y-2.5">
          {/* Order Statistics Section */}
          {orderStatsLoading ? (
            <InfoItem text="Loading order statistics..." />
          ) : orderStatsError ? (
            <InfoItem text={`Error: ${String(orderStatsError)}`} />
          ) : (
            <>
              <InfoItem
                text={`Total Orders: ${orderStatistics?.totalOrders || 0}`}
              />
              <InfoItem
                text={`Completed Orders: ${
                  orderStatistics?.completedOrders || 0
                } (${orderStatistics?.completionRate?.toFixed(1) || 0}%)`}
              />
            </>
          )}
          <InfoItem
            text={`Active Listings: ${
              productsLoading
                ? "Loading..."
                : typeof activeListingsCount === "number"
                ? activeListingsCount.toString()
                : String(activeListingsCount)
            }`}
          />
          {productsError &&
            (() => {
              let errorMessage = "Error loading products: Unknown error";
              if (typeof productsError === "string") {
                errorMessage = `Error loading products: ${productsError}`;
              } else if (productsError instanceof Error) {
                errorMessage = `Error loading products: ${productsError.message}`;
              }
              return <InfoItem text={errorMessage} />;
            })()}
          <InfoItem text={`Last Live: Aug 30, 2025 (Bronze)`} />
          <InfoItem text={`Next Slot: Sep 6, 2025 14:00 (Bronze)`} />
          <InfoItem text={`Wallet Balance: ₦340,000`} />
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default SellerOverview;
