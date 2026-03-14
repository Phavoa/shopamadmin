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
  Calendar,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  useGetFinancialStatsQuery,
  useGetFinanceOverviewQuery,
  FinanceOverviewPeriod,
} from "@/api/adminDashboardApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showAdditional, setShowAdditional] = useState(false);

  // Derive state from URL
  const period =
    (searchParams.get("period") as FinanceOverviewPeriod) || "today";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const updateUrl = (params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const handlePeriodChange = (newPeriod: string) => {
    const params: Record<string, string | undefined> = {
      period: newPeriod,
      from: undefined,
      to: undefined,
    };
    updateUrl(params);
  };

  const handleCustomDateChange = (type: "from" | "to", value: string) => {
    updateUrl({ [type]: value });
  };

  // ✅ Single query replaces all three old revenueApi hooks
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useGetFinancialStatsQuery();
  const stats = statsData?.data;

  // Fetch overview for ShopAm Revenue and Escrow Balance
  // Only trigger custom fetch when both dates are present
  const shouldFetchCustom = period !== "custom" || (!!from && !!to);

  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isFetching: isOverviewFetching,
    isError: isOverviewError,
  } = useGetFinanceOverviewQuery(
    {
      period,
      from: period === "custom" ? from : undefined,
      to: period === "custom" ? to : undefined,
    },
    { skip: !shouldFetchCustom },
  );
  const overview = overviewData?.data;

  const isDataLoading =
    isStatsLoading ||
    isOverviewLoading ||
    (shouldFetchCustom && isOverviewFetching);

  const hasError = isStatsError || (shouldFetchCustom && isOverviewError);

  const periodLabel =
    period === "custom"
      ? "Custom Range"
      : period.charAt(0).toUpperCase() +
        period.slice(1).replace("all", "All Time");

  const kpis: KPI[] = [
    {
      title: `GMV (${periodLabel})`,
      value: formatNaira(
        period === "today" ? stats?.gmv?.today : overview?.gmvToday?.amount,
      ),
      meta:
        period === "today"
          ? `${(stats?.gmv?.percentChange ?? 0) >= 0 ? "+" : ""}${(
              stats?.gmv?.percentChange ?? 0
            ).toFixed(1)}% vs yesterday`
          : overview?.gmvToday?.comparedToLabel,
      icon: <DollarSign className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading: isDataLoading,
    },
    {
      title: `Orders (${periodLabel})`,
      value: String(
        (period === "today"
          ? stats?.orders?.today
          : overview?.payoutsProcessed?.count) ?? "—",
      ),
      meta:
        period === "today"
          ? `${(stats?.orders?.percentChange ?? 0) >= 0 ? "+" : ""}${(
              stats?.orders?.percentChange ?? 0
            ).toFixed(1)}% vs yesterday`
          : overview?.payoutsProcessed?.periodLabel,
      icon: <Package className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading: isDataLoading,
    },
    {
      title: "Active Streams Now",
      value: String(stats?.livestreams?.activeCount ?? "—"),
      meta: `Viewers: ${(stats?.livestreams?.totalViewers ?? 0).toLocaleString()}`,
      icon: <Radio className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading: isStatsLoading,
    },
    {
      title: "ShopAM Revenue",
      value: formatNaira(
        period === "today"
          ? stats?.shopamRevenue?.total
          : overview?.shopamRevenue?.amount,
      ),
      meta:
        period === "today"
          ? `6%: ${formatNaira(
              stats?.shopamRevenue?.breakdown?.tier1_6pct,
            )} | 5%: ${formatNaira(
              stats?.shopamRevenue?.breakdown?.tier2_5pct,
            )} | 4%: ${formatNaira(stats?.shopamRevenue?.breakdown?.tier3_4pct)}`
          : overview?.shopamRevenue?.subtitle,
      icon: <Percent className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading: isDataLoading,
    },
  ];

  const additionalKpis: KPI[] = [
    {
      title: "Escrow Balance",
      value: formatNaira(
        period === "today"
          ? stats?.escrowBalance
          : overview?.escrowBalance?.amount,
      ),
      meta:
        period === "today" ? "Funds held" : overview?.escrowBalance?.subtitle,
      icon: <Wallet className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading: isDataLoading,
    },
    {
      title:
        period === "today"
          ? "Payouts Pending"
          : `Payouts Processed (${periodLabel})`,
      value: formatNaira(
        period === "today"
          ? stats?.payoutsPending
          : overview?.payoutsProcessed?.totalAmount,
      ),
      meta:
        period === "today"
          ? "Awaiting processing"
          : overview?.payoutsProcessed?.periodLabel,
      icon: <Banknote className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading: isDataLoading,
    },
    {
      title: `VAT Revenue (${periodLabel})`,
      value: formatNaira(
        period === "today"
          ? stats?.vatRevenue
          : overview?.vatCollection?.amount,
      ),
      meta:
        period === "today"
          ? "7.5% VAT collected"
          : overview?.vatCollection?.subtitle || "7.5% VAT collected",
      icon: <Receipt className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading: isDataLoading,
    },
    {
      title: "Livestream Revenue",
      value: formatNaira(stats?.livestreamRevenue?.totalAmount),
      meta: `${stats?.livestreamRevenue?.totalSellersPaid ?? 0} sellers paid`,
      icon: <Video className="w-5 h-5 text-[var(--sidebar-primary)]" />,
      isLoading: isStatsLoading,
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-black/80">
          Financial Overview
        </h2>
        {hasError && (
          <div className="bg-red-50 text-red-600 p-2 rounded-md text-sm border border-red-100 animate-in fade-in duration-300">
            Error fetching dashboard data. Results may be incomplete.
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          {period === "custom" && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-500">
              <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-[var(--primary)] transition-colors" />
                <Input
                  type="date"
                  value={from}
                  onChange={(e) => handleCustomDateChange("from", e.target.value)}
                  className="w-44 h-10 pl-10 bg-[#F5F5F5] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[var(--primary)]/20 transition-all cursor-pointer"
                />
              </div>
              <span className="text-gray-400 font-medium">to</span>
              <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-[var(--primary)] transition-colors" />
                <Input
                  type="date"
                  value={to}
                  onChange={(e) => handleCustomDateChange("to", e.target.value)}
                  className="w-44 h-10 pl-10 bg-[#F5F5F5] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[var(--primary)]/20 transition-all cursor-pointer"
                />
              </div>
            </div>
          )}
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px] h-10 bg-[#F5F5F5] border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[var(--primary)]/20 transition-all">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[0.3px] border-black/10 shadow-lg">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
    </div>
  );
}

export { KPIGrid };
