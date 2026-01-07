import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  Box,
  Activity,
  Wifi,
  Radio,
  Package,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Wallet,
  Banknote,
  TriangleAlert,
  Percent,
  Receipt,
  Video,
} from "lucide-react";
import {
  useGetShopAmRevenueQuery,
  useGetVatRevenueQuery,
  useGetLivestreamRevenueQuery,
} from "@/api/revenueApi";

type KPI = {
  title: string;
  value: string;
  meta?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
};

const kpis: KPI[] = [
  {
    title: "GMV (Today)",
    value: "₦2.5M",
    meta: "+2% vs yesterday",
    icon: <DollarSign className="w-5 h-5  text-[var(--sidebar-primary)]" />,
  },
  {
    title: "Orders (Today)",
    value: "640",
    meta: "+4% vs yesterday",
    icon: <Package className="w-5 h-5 text-[var(--sidebar-primary)]" />,
  },
  {
    title: "Active Streams Now",
    value: "12",
    meta: "Viewers: 1,800",
    icon: <Radio className="w-5 h-5 text-[var(--sidebar-primary)]" />,
  },
  {
    title: "ShopAm Revenue",
    value: "₦2.68M",
    meta: "6%: ₦1.25M | 5%: ₦980K | 3%: ₦450K",
    icon: <Percent className="w-5 h-5 text-[var(--sidebar-primary)]" />,
  },
];

const additionalKpis: KPI[] = [
  {
    title: "Escrow Balance",
    value: "₦12.6M",
    meta: "Funds held",
    icon: <Wallet className="w-5 h-5 text-[var(--sidebar-primary)]" />,
  },
  {
    title: "Payouts Pending",
    value: "32",
    meta: "60% 48h",
    icon: <Banknote className="w-5 h-5 text-[var(--sidebar-primary)]" />,
  },
  {
    title: "VAT Revenue",
    value: "₦850K",
    meta: "7.5% VAT | 1,250 transactions",
    icon: <Receipt className="w-5 h-5 text-[var(--sidebar-primary)]" />,
  },
  {
    title: "Livestream Revenue",
    value: "₦1.56M",
    meta: "78 sellers | ₦20K avg fee",
    icon: <Video className="w-5 h-5 text-[var(--sidebar-primary)]" />,
  },
];

function KPIGrid() {
  const [showAdditional, setShowAdditional] = useState(false);

  // Fetch revenue data
  const { data: shopAmRevenue, isLoading: shopAmLoading } =
    useGetShopAmRevenueQuery();
  const { data: vatRevenue, isLoading: vatLoading } = useGetVatRevenueQuery();
  const { data: livestreamRevenue, isLoading: livestreamLoading } =
    useGetLivestreamRevenueQuery();

  // Format currency helper
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("NGN", "₦");
  };

  // Format number helper
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-NG").format(num);
  };

  // Update KPI values with fetched data
  const updatedKpis = kpis.map((kpi, index) => {
    if (kpi.title === "ShopAm Revenue" && shopAmRevenue) {
      return {
        ...kpi,
        value: formatCurrency(shopAmRevenue.total),
        meta: `6%: ${formatCurrency(
          shopAmRevenue.sixPercent
        )} | 5%: ${formatCurrency(
          shopAmRevenue.fivePercent
        )} | 3%: ${formatCurrency(shopAmRevenue.threePercent)}`,
        isLoading: shopAmLoading,
      };
    }
    return kpi;
  });

  const updatedAdditionalKpis = additionalKpis.map((kpi) => {
    if (kpi.title === "VAT Revenue" && vatRevenue) {
      return {
        ...kpi,
        value: formatCurrency(vatRevenue.vatCollected),
        meta: `${vatRevenue.vatRate}% VAT | ${formatNumber(
          vatRevenue.applicableTransactions
        )} transactions`,
        isLoading: vatLoading,
      };
    }
    if (kpi.title === "Livestream Revenue" && livestreamRevenue) {
      return {
        ...kpi,
        value: formatCurrency(livestreamRevenue.totalFees),
        meta: `${formatNumber(
          livestreamRevenue.totalSellers
        )} sellers | ${formatCurrency(livestreamRevenue.averageFee)} avg fee`,
        isLoading: livestreamLoading,
      };
    }
    return kpi;
  });

  return (
    <div className="flex items-center relative">
      <div className="flex-1">
        <section
          aria-label="Key metrics"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-md)]"
        >
          {updatedKpis.map((k) => (
            <div
              key={k.title}
              className="p-5  rounded-2xl border-l border-l-gray-200 border-t border-t-gray-200 border-b border-b-gray-200 border-r border-r-gray-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-black/90">
                    {k.title}
                  </h3>
                  <div className="mt-8 text-3xl font-bold text-balck">
                    {k.isLoading ? (
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                    ) : (
                      k.value
                    )}
                  </div>
                  {k.meta && (
                    <div className="text-sm  text-black/80 mt-1">{k.meta}</div>
                  )}
                </div>
                <div className="text-[var(--muted-foreground)]">{k.icon}</div>
              </div>
            </div>
          ))}
        </section>
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showAdditional
              ? "max-h-96 opacity-100 mt-[var(--space-md)]"
              : "max-h-0 opacity-0"
          }`}
        >
          <section
            aria-label="Additional metrics"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-md)]"
          >
            {updatedAdditionalKpis.map((k) => (
              <div
                key={k.title}
                className="p-5  rounded-2xl border-l border-l-gray-200 border-t border-t-gray-200 border-b border-b-gray-200 border-r border-r-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-black/90">
                      {k.title}
                    </h3>
                    <div className="mt-8 text-3xl font-bold text-balck">
                      {k.isLoading ? (
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                      ) : (
                        k.value
                      )}
                    </div>
                    {k.meta && (
                      <div className="text-sm  text-black/80 mt-1">
                        {k.meta}
                      </div>
                    )}
                  </div>
                  <div className="text-[var(--muted-foreground)]">{k.icon}</div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
      <div className="flex items-center justify-center -mr-10 absolute right-5 top-1/2 transform -translate-y-1/2 z-50">
        <button
          onClick={() => setShowAdditional(!showAdditional)}
          className="flex items-center gap-2 p-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
        >
          {showAdditional ? (
            <ChevronLeft className="w-8 h-8" />
          ) : (
            <ChevronRight className="w-8 h-8" />
          )}
        </button>
      </div>
    </div>
  );
}

export { KPIGrid };
