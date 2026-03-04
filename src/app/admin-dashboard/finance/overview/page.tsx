"use client";

import React, { useState } from "react";
import { useGetFinancialStatsQuery, useGetFinanceOverviewQuery, FinanceOverviewPeriod } from "@/api/adminDashboardApi";

const formatNaira = (amount: string | undefined): string => {
  if (!amount || amount === "0") return "₦0";
  const naira = Number(amount);
  if (naira >= 1_000_000) return `₦${(naira / 1_000_000).toFixed(1)}M`;
  if (naira >= 1_000) return `₦${(naira / 1_000).toFixed(1)}K`;
  return `₦${naira.toLocaleString("en-NG")}`;
};

const formatPercent = (val: number): string => {
  const sign = val >= 0 ? "+" : "";
  return `${sign}${val.toFixed(1)}% vs yesterday`;
};

// Map dropdown label → API period param
const PERIOD_OPTIONS: { label: string; value: FinanceOverviewPeriod }[] = [
  { label: "Today",        value: "today" },
  { label: "Last 7 days",  value: "week"  },
  { label: "Last 30 days", value: "month" },
  { label: "Last 90 days", value: "year"  },
  { label: "All time",     value: "all"   },
];

const DollarSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18.5625 15.75C18.561 16.8933 18.1062 17.9893 17.2978 18.7978C16.4893 19.6062 15.3933 20.061 14.25 20.0625H12.5625V21.75C12.5625 21.8992 12.5032 22.0423 12.3977 22.1477C12.2923 22.2532 12.1492 22.3125 12 22.3125C11.8508 22.3125 11.7077 22.2532 11.6023 22.1477C11.4968 22.0423 11.4375 21.8992 11.4375 21.75V20.0625H9.75C8.60671 20.061 7.51067 19.6062 6.70225 18.7978C5.89382 17.9893 5.43899 16.8933 5.4375 15.75C5.4375 15.6008 5.49676 15.4577 5.60225 15.3523C5.70774 15.2468 5.85082 15.1875 6 15.1875C6.14918 15.1875 6.29226 15.2468 6.39775 15.3523C6.50324 15.4577 6.5625 15.6008 6.5625 15.75C6.5625 16.5954 6.89832 17.4061 7.4961 18.0039C8.09387 18.6017 8.90462 18.9375 9.75 18.9375H14.25C15.0954 18.9375 15.9061 18.6017 16.5039 18.0039C17.1017 17.4061 17.4375 16.5954 17.4375 15.75C17.4375 14.9046 17.1017 14.0939 16.5039 13.4961C15.9061 12.8983 15.0954 12.5625 14.25 12.5625H10.5C9.35625 12.5625 8.25935 12.1081 7.4506 11.2994C6.64185 10.4906 6.1875 9.39375 6.1875 8.25C6.1875 7.10625 6.64185 6.00935 7.4506 5.2006C8.25935 4.39185 9.35625 3.9375 10.5 3.9375H11.4375V2.25C11.4375 2.10082 11.4968 1.95774 11.6023 1.85225C11.7077 1.74676 11.8508 1.6875 12 1.6875C12.1492 1.6875 12.2923 1.74676 12.3977 1.85225C12.5032 1.95774 12.5625 2.10082 12.5625 2.25V3.9375H13.5C14.6433 3.93899 15.7393 4.39382 16.5478 5.20225C17.3562 6.01067 17.811 7.10671 17.8125 8.25C17.8125 8.39918 17.7532 8.54226 17.6477 8.64775C17.5423 8.75324 17.3992 8.8125 17.25 8.8125C17.1008 8.8125 16.9577 8.75324 16.8523 8.64775C16.7468 8.54226 16.6875 8.39918 16.6875 8.25C16.6875 7.40462 16.3517 6.59387 15.7539 5.9961C15.1561 5.39832 14.3454 5.0625 13.5 5.0625H10.5C9.65462 5.0625 8.84387 5.39832 8.2461 5.9961C7.64832 6.59387 7.3125 7.40462 7.3125 8.25C7.3125 9.09538 7.64832 9.90613 8.2461 10.5039C8.84387 11.1017 9.65462 11.4375 10.5 11.4375H14.25C15.3933 11.439 16.4893 11.8938 17.2978 12.7022C18.1062 13.5107 18.561 14.6067 18.5625 15.75Z" fill="#E67E22"/>
  </svg>
);

export default function FinanceOverviewPage() {
  // ── Period state for the bar chart dropdown ──────────────────────────────────
  const [period, setPeriod] = useState<FinanceOverviewPeriod>("week");

  // ── Existing KPI cards query (unchanged) ─────────────────────────────────────
  const { data: kpiData, isLoading: kpiLoading } = useGetFinancialStatsQuery();
  const stats = kpiData?.data;

  // ── Finance overview query — drives bar chart & payout volume ─────────────────
  const { data: overviewData, isLoading: overviewLoading, isFetching: overviewFetching } =
    useGetFinanceOverviewQuery({ period });
  const overview = overviewData?.data;

  // ── KPI cards — real API data ────────────────────────────────────────────────
  const kpiCards = [
    {
      title: "GMV (Today)",
      value: kpiLoading ? "..." : formatNaira(stats?.gmv?.today),
      subtitle: kpiLoading ? "" : formatPercent(stats?.gmv?.percentChange ?? 0),
      subtitleColor: (stats?.gmv?.percentChange ?? 0) >= 0 ? "#10B981" : "#EF4444",
    },
    {
      title: "Escrow Balance",
      value: kpiLoading ? "..." : formatNaira(stats?.escrowBalance),
      subtitle: "Funds held for buyers",
      subtitleColor: "#6B7280",
    },
    {
      title: "Payouts Pending",
      value: kpiLoading ? "..." : formatNaira(stats?.payoutsPending),
      subtitle: "Awaiting processing",
      subtitleColor: "#6B7280",
    },
    {
      title: "ShopAM Revenue",
      value: kpiLoading ? "..." : formatNaira(stats?.shopamRevenue?.total),
      subtitle: "Commissions + fees",
      subtitleColor: "#6B7280",
    },
  ];

  // ── Bar chart — real revenueTrend data ───────────────────────────────────────
  const trendPoints = overview?.revenueTrend ?? [];
  const maxTrend = Math.max(...trendPoints.map((p) => Number(p.value)), 1);
  // Heights as percentages relative to the tallest bar (max = 100%)
  const chartBars = trendPoints.map((p) => ({
    label: p.label,
    heightPct: Math.max(Math.round((Number(p.value) / maxTrend) * 100), 2),
    raw: Number(p.value),
  }));

  // ── Payout volume — real payoutVolume data ────────────────────────────────────
  const payoutPoints = overview?.payoutVolume ?? [];
  const maxPayout = Math.max(...payoutPoints.map((p) => Number(p.value)), 1);
  const payoutBars = payoutPoints.map((p) => ({
    label: p.label,
    width: Math.round((Number(p.value) / maxPayout) * 100),
    amount: formatNaira(p.value),
  }));

  // ── Finance alerts — from overview API (or fallback to financials) ─────────────
  const financeAlerts = overview?.alerts?.length
    ? overview.alerts
    : [
        { type: "PAYOUT",   title: "Payouts Pending",    subtitle: `${formatNaira(stats?.payoutsPending)} awaiting processing`,              actionLabel: "Review" },
        { type: "ESCROW",   title: "Escrow Balance",     subtitle: `Current balance: ${formatNaira(stats?.escrowBalance)}`,                  actionLabel: "View"   },
        { type: "VAT",      title: "VAT Revenue",        subtitle: `Collected: ${formatNaira(stats?.vatRevenue)}`,                           actionLabel: "Details"},
        { type: "LIVE",     title: "Active Livestreams", subtitle: `${stats?.livestreams?.activeCount ?? 0} live · ${stats?.livestreams?.totalViewers ?? 0} viewers`, actionLabel: "Monitor"},
      ];

  const isChartLoading = overviewLoading || overviewFetching;
  const selectedLabel = PERIOD_OPTIONS.find((o) => o.value === period)?.label ?? "Last 7 days";

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-">
      <div className="space-y-6">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-black">Finance Overview</h1>

        {/* KPI Cards */}
        <div className="flex gap-6">
          {kpiCards.map((kpi, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                width: "290px",
                padding: "20px",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "18px",
                flexShrink: 0,
                borderRadius: "18px",
                border: "0.3px solid rgba(0, 0, 0, 0.20)",
                background: "#FFF",
              }}
            >
              <div className="flex items-start justify-between w-full">
                <p className="text-sm text-gray-700">{kpi.title}</p>
                <DollarSignIcon />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-black mb-1">{kpi.value}</h3>
                <p className="text-xs" style={{ color: kpi.subtitleColor }}>{kpi.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Daily Revenue Trend — real data from revenueTrend[] ─────────────── */}
        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "1230px",
            padding: "24px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "24px",
            alignSelf: "stretch",
            borderRadius: "18px",
            border: "0.3px solid rgba(0, 0, 0, 0.20)",
            background: "#FFF",
          }}
        >
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold text-black">
              Revenue Trend
              {isChartLoading && (
                <span className="ml-2 text-sm font-normal text-gray-400">Loading…</span>
              )}
            </h2>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as FinanceOverviewPeriod)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
              style={{ borderRadius: "8px" }}
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-end",
              width: "100%",
              height: "320px",
              gap: "12px",
              paddingBottom: "8px",
            }}
          >
            {/* Loading skeleton */}
            {isChartLoading && (
              <>
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center" style={{ flex: 1 }}>
                    <div className="w-full flex items-end justify-center" style={{ height: "240px" }}>
                      <div
                        style={{
                          width: "50%",
                          height: `${40 + Math.random() * 50}%`,
                          background: "#E5E7EB",
                          borderRadius: "4px 4px 0 0",
                          animation: "pulse 1.5s ease-in-out infinite",
                        }}
                      />
                    </div>
                    <div className="h-3 w-4 bg-gray-200 rounded mt-2" />
                  </div>
                ))}
              </>
            )}

            {/* Real bars */}
            {!isChartLoading && chartBars.length > 0 && chartBars.map((bar, index) => (
              <div
                key={index}
                className="flex flex-col items-center group"
                style={{ flex: "0 1 60px", position: "relative" }}
                title={formatNaira(bar.raw.toString())}
              >
                <div className="w-full flex items-end justify-center" style={{ height: "240px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: `${bar.heightPct}%`,
                      background: "#0066FF",
                      borderRadius: "6px 6px 0 0",
                      transition: "height 0.5s ease",
                    }}
                    className="hover:opacity-80 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] font-medium text-gray-500 mt-3">{bar.label}</p>
              </div>
            ))}

            {/* Empty state */}
            {!isChartLoading && chartBars.length === 0 && (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-gray-400 text-sm">No revenue data available for {selectedLabel}.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex gap-6">
          {/* ── Payout Volume — real payoutVolume[] data ────────────────────── */}
          <div
            style={{
              display: "flex",
              width: "610px",
              minHeight: "230px",
              padding: "20px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "24px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h2 className="text-lg font-semibold text-black">Payout Volume</h2>
            <div className="space-y-4 w-full">
              {isChartLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                      <div className="flex-1 h-3 bg-gray-100 rounded animate-pulse" />
                      <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))
                : payoutBars.length > 0
                  ? payoutBars.map((payout, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <p className="text-sm text-gray-700 w-20 truncate">{payout.label}</p>
                        <div className="flex-1 relative">
                          <div style={{ width: "400px", height: "14px", flexShrink: 0, borderRadius: "6px", background: "#FFF1E5" }}>
                            <div
                              style={{
                                width: `${payout.width}%`,
                                height: "14px",
                                borderRadius: "6px",
                                background: "#E67E22",
                                transition: "width 0.6s ease",
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-black w-16 text-right">{payout.amount}</p>
                      </div>
                    ))
                  : (
                    // Fallback to existing financials-API data when overview has no payoutVolume
                    (() => {
                      const gmvToday = Number(stats?.gmv?.today ?? 0);
                      const gmvYesterday = Number(stats?.gmv?.yesterday ?? 0);
                      const payoutsPending = Number(stats?.payoutsPending ?? 0);
                      const livestreamRevenue = Number(stats?.livestreamRevenue?.totalAmount ?? 0);
                      const maxVal = Math.max(gmvToday, gmvYesterday, payoutsPending, livestreamRevenue, 1);
                      return [
                        { label: "GMV Today",  width: Math.round((gmvToday / maxVal) * 100),          amount: formatNaira(stats?.gmv?.today) },
                        { label: "GMV Yest.",  width: Math.round((gmvYesterday / maxVal) * 100),       amount: formatNaira(stats?.gmv?.yesterday) },
                        { label: "Pending",    width: Math.round((payoutsPending / maxVal) * 100),     amount: formatNaira(stats?.payoutsPending) },
                        { label: "Livestream", width: Math.round((livestreamRevenue / maxVal) * 100),  amount: formatNaira(stats?.livestreamRevenue?.totalAmount) },
                      ].map((row, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <p className="text-sm text-gray-700 w-20">{row.label}</p>
                          <div className="flex-1 relative">
                            <div style={{ width: "400px", height: "14px", flexShrink: 0, borderRadius: "6px", background: "#FFF1E5" }}>
                              <div
                                style={{
                                  width: kpiLoading ? "0%" : `${row.width}%`,
                                  height: "14px",
                                  borderRadius: "6px",
                                  background: "#E67E22",
                                  transition: "width 0.6s ease",
                                }}
                              />
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-black w-16 text-right">
                            {kpiLoading ? "..." : row.amount}
                          </p>
                        </div>
                      ));
                    })()
                  )
              }
            </div>
          </div>

          {/* Finance Alerts */}
          <div
            style={{
              display: "flex",
              width: "600px",
              padding: "20px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "24px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h2 className="text-lg font-semibold text-black">Finance Alerts</h2>
            <div className="space-y-4 w-full">
              {financeAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-black mb-1">{alert.title}</h3>
                    <p className="text-xs text-gray-600">
                      {kpiLoading && !overview ? "Loading..." : alert.subtitle}
                    </p>
                  </div>
                  <button
                    style={{
                      display: "flex",
                      width: "68px",
                      height: "27px",
                      padding: "4px 10px",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      borderRadius: "8px",
                      background: "#E67E22",
                      color: "#FFF",
                      fontFamily: "Work Sans",
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "normal",
                      letterSpacing: "0.24px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {alert.actionLabel}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}