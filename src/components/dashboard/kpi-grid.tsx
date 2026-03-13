import React, { useState } from "react";
import {
  DollarSign,
  Package,
  Radio,
  Percent,
  Wallet,
  Banknote,
  Receipt,
  Video,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  useGetFinancialStatsQuery,
  useGetFinanceOverviewQuery,
} from "@/api/adminDashboardApi";

type KPI = {
  title: string;
  value: string;
  meta?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
};

const formatNaira = (amount: string | number | undefined): string => {
  if (!amount || amount === "0") return "₦0";
  const naira = Number(amount) / 100;
  if (naira >= 1_000_000) return `₦${(naira / 1_000_000).toFixed(1)}M`;
  if (naira >= 1_000) return `₦${(naira / 1_000).toFixed(1)}K`;
  return `₦${naira.toLocaleString("en-NG")}`;
};

function KPIGrid() {
  const [showAdditional, setShowAdditional] = useState(false);

  // ✅ Single query replaces all three old revenueApi hooks
  const { data, isLoading } = useGetFinancialStatsQuery();
  const stats = data?.data;

  // Fetch overview for ShopAm Revenue and Escrow Balance
  const { data: overviewData, isLoading: isOverviewLoading } =
    useGetFinanceOverviewQuery({ period: "today" });
  const overview = overviewData?.data;

  const kpis: KPI[] = [
    {
      title: "GMV (Today)",
      value: formatNaira(stats?.gmv?.today),
      meta: `${(stats?.gmv?.percentChange ?? 0) >= 0 ? "+" : ""}${(stats?.gmv?.percentChange ?? 0).toFixed(1)}% vs yesterday`,
      icon: <DollarSign className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading,
    },
    {
      title: "Orders (Today)",
      value: String(stats?.orders?.today ?? "—"),
      meta: `${(stats?.orders?.percentChange ?? 0) >= 0 ? "+" : ""}${(stats?.orders?.percentChange ?? 0).toFixed(1)}% vs yesterday`,
      icon: <Package className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading,
    },
    {
      title: "Active Streams Now",
      value: String(stats?.livestreams?.activeCount ?? "—"),
      meta: `Viewers: ${(stats?.livestreams?.totalViewers ?? 0).toLocaleString()}`,
      icon: <Radio className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading,
    },
    {
      title: "ShopAM Revenue",
      value: formatNaira(overview?.shopamRevenue?.amount),
      meta: `6%: ${formatNaira(stats?.shopamRevenue?.breakdown?.tier1_6pct)} | 5%: ${formatNaira(stats?.shopamRevenue?.breakdown?.tier2_5pct)} | 4%: ${formatNaira(stats?.shopamRevenue?.breakdown?.tier3_4pct)}`,
      icon: <Percent className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading: isOverviewLoading || isLoading,
    },
  ];

  const additionalKpis: KPI[] = [
    {
      title: "Escrow Balance",
      value: formatNaira(overview?.escrowBalance?.amount),
      meta: "Funds held",
      icon: <Wallet className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading: isOverviewLoading || isLoading,
    },
    {
      title: "Payouts Pending",
      value: formatNaira(stats?.payoutsPending),
      meta: "Awaiting processing",
      icon: <Banknote className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading,
    },
    {
      title: "VAT Revenue",
      value: formatNaira(stats?.vatRevenue),
      meta: "7.5% VAT collected",
      icon: <Receipt className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading,
    },
    {
      title: "Livestream Revenue",
      value: formatNaira(stats?.livestreamRevenue?.totalAmount),
      meta: `${stats?.livestreamRevenue?.totalSellersPaid ?? 0} sellers paid`,
      icon: <Video className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading,
    },
  ];

  const renderCard = (k: KPI) => (
    <div
      key={k.title}
      className="p-5 rounded-2xl border-l border-l-gray-200 border-t border-t-gray-200 border-b border-b-gray-200 border-r border-r-gray-100"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-black/90">{k.title}</h3>
          <div className="mt-8 text-3xl font-bold text-black">
            {k.isLoading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
            ) : (
              k.value
            )}
          </div>
          {k.meta && (
            <div className="text-sm text-black/80 mt-1">
              {k.isLoading ? (
                <div className="h-4 bg-gray-100 rounded animate-pulse w-32 mt-1" />
              ) : (
                k.meta
              )}
            </div>
          )}
        </div>
        <div className="text-[var(--muted-foreground)]">{k.icon}</div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center relative">
      <div className="flex-1">
        <section
          aria-label="Key metrics"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-md)]"
        >
          {kpis.map(renderCard)}
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
            {additionalKpis.map(renderCard)}
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
