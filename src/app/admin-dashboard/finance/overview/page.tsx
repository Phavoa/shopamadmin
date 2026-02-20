"use client";

import React from "react";

// Dollar Sign SVG Icon
const DollarSignIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M18.5625 15.75C18.561 16.8933 18.1062 17.9893 17.2978 18.7978C16.4893 19.6062 15.3933 20.061 14.25 20.0625H12.5625V21.75C12.5625 21.8992 12.5032 22.0423 12.3977 22.1477C12.2923 22.2532 12.1492 22.3125 12 22.3125C11.8508 22.3125 11.7077 22.2532 11.6023 22.1477C11.4968 22.0423 11.4375 21.8992 11.4375 21.75V20.0625H9.75C8.60671 20.061 7.51067 19.6062 6.70225 18.7978C5.89382 17.9893 5.43899 16.8933 5.4375 15.75C5.4375 15.6008 5.49676 15.4577 5.60225 15.3523C5.70774 15.2468 5.85082 15.1875 6 15.1875C6.14918 15.1875 6.29226 15.2468 6.39775 15.3523C6.50324 15.4577 6.5625 15.6008 6.5625 15.75C6.5625 16.5954 6.89832 17.4061 7.4961 18.0039C8.09387 18.6017 8.90462 18.9375 9.75 18.9375H14.25C15.0954 18.9375 15.9061 18.6017 16.5039 18.0039C17.1017 17.4061 17.4375 16.5954 17.4375 15.75C17.4375 14.9046 17.1017 14.0939 16.5039 13.4961C15.9061 12.8983 15.0954 12.5625 14.25 12.5625H10.5C9.35625 12.5625 8.25935 12.1081 7.4506 11.2994C6.64185 10.4906 6.1875 9.39375 6.1875 8.25C6.1875 7.10625 6.64185 6.00935 7.4506 5.2006C8.25935 4.39185 9.35625 3.9375 10.5 3.9375H11.4375V2.25C11.4375 2.10082 11.4968 1.95774 11.6023 1.85225C11.7077 1.74676 11.8508 1.6875 12 1.6875C12.1492 1.6875 12.2923 1.74676 12.3977 1.85225C12.5032 1.95774 12.5625 2.10082 12.5625 2.25V3.9375H13.5C14.6433 3.93899 15.7393 4.39382 16.5478 5.20225C17.3562 6.01067 17.811 7.10671 17.8125 8.25C17.8125 8.39918 17.7532 8.54226 17.6477 8.64775C17.5423 8.75324 17.3992 8.8125 17.25 8.8125C17.1008 8.8125 16.9577 8.75324 16.8523 8.64775C16.7468 8.54226 16.6875 8.39918 16.6875 8.25C16.6875 7.40462 16.3517 6.59387 15.7539 5.9961C15.1561 5.39832 14.3454 5.0625 13.5 5.0625H10.5C9.65462 5.0625 8.84387 5.39832 8.2461 5.9961C7.64832 6.59387 7.3125 7.40462 7.3125 8.25C7.3125 9.09538 7.64832 9.90613 8.2461 10.5039C8.84387 11.1017 9.65462 11.4375 10.5 11.4375H14.25C15.3933 11.439 16.4893 11.8938 17.2978 12.7022C18.1062 13.5107 18.561 14.6067 18.5625 15.75Z"
      fill="#E67E22"
    />
  </svg>
);

export default function FinanceOverviewPage() {
  // Sample data for KPIs
  const kpiData = [
    {
      title: "GMV (Today)",
      value: "₦2.5M",
      subtitle: "+12% vs last week",
      subtitleColor: "#10B981",
    },
    {
      title: "Escrow Balance",
      value: "640",
      subtitle: "Funds held for buyers",
      subtitleColor: "#6B7280",
    },
    {
      title: "Payouts Processed",
      value: "12",
      subtitle: "Last 7 days",
      subtitleColor: "#6B7280",
    },
    {
      title: "ShopAM Revenue",
      value: "₦3.1M",
      subtitle: "Commissions + fees",
      subtitleColor: "#6B7280",
    },
  ];

  // Sample data for daily revenue (heights in percentage)
  const dailyRevenue = [
    { day: "1", height: 130 },
    { day: "2", height: 120 },
    { day: "3", height: 90 },
    { day: "4", height: 75 },
    { day: "5", height: 100 },
    { day: "6", height: 80 },
    { day: "7", height: 65 },
    { day: "8", height: 140 },
    { day: "9", height: 78 },
    { day: "10", height: 55 },
    { day: "11", height: 25 },
    { day: "12", height: 72 },
    { day: "13", height: 68 },
    { day: "14", height: 100 },
  ];

  // Sample data for payout volume (widths in percentage)
  const payoutVolume = [
    { week: "Week 1", width: 55, amount: "2.1M" },
    { week: "Week 2", width: 75, amount: "2.1M" },
    { week: "Week 3", width: 65, amount: "2.1M" },
    { week: "Week 4", width: 95, amount: "2.1M" },
  ];

  // Sample data for finance alerts
  const financeAlerts = [
    {
      title: "Pending payout approval",
      description: "NGN 1.2M across 54 sellers",
      button: "Review",
    },
    {
      title: "Failed payout",
      description: "Seller: Next Gadgets NGN 200,000",
      button: "Retry",
    },
    {
      title: "Low escrow threshold",
      description: "Balance below NGN 10M",
      button: "Top-up",
    },
    {
      title: "Exceptions",
      description: "NGN 450,000 pending from disputes",
      button: "Investigate",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      <div className="space-y-6">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-black">Finance Overview</h1>

        {/* KPI Cards Grid */}
        <div className="flex gap-6">
          {kpiData.map((kpi, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                width: "320px",
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
                <h3 className="text-3xl font-bold text-black mb-1">
                  {kpi.value}
                </h3>
                <p className="text-xs" style={{ color: kpi.subtitleColor }}>
                  {kpi.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Revenue Trend Chart */}
        <div
          style={{
            display: "flex",
            padding: "20px",
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
              Daily Revenue Trend (Last 14 days)
            </h2>
            <select
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
              style={{ borderRadius: "8px" }}
            >
              <option>Last 14 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          {/* Bar Chart */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              width: "100%",
              height: "380px",
            }}
          >
            {dailyRevenue.map((data, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{ flex: 1 }}
              >
                <div
                  className="w-full flex items-end justify-center"
                  style={{ height: "240px" }}
                >
                  <div
                    style={{
                      width: "50%",
                      height: `${data.height}%`,
                      background: "#0066FF",
                      borderRadius: "4px 4px 0 0",
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{data.day}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Payout Volume & Finance Alerts */}
        <div className="flex gap-6">
          {/* Payout Volume */}
          <div
            style={{
              display: "flex",
              width: "610px",
              height: "230px",
              padding: "20px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "24px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h2 className="text-lg font-semibold text-black">
              Payout Volume (Weekly)
            </h2>
            <div className="space-y-4 w-full">
              {payoutVolume.map((payout, index) => (
                <div key={index} className="flex items-center gap-4">
                  <p className="text-sm text-gray-700 w-16">{payout.week}</p>
                  <div className="flex-1 relative">
                    <div
                      style={{
                        width: "443px",
                        height: "14px",
                        flexShrink: 0,
                        borderRadius: "6px",
                        background: "#FFF1E5",
                      }}
                    >
                      <div
                        style={{
                          width: `${payout.width}%`,
                          height: "14px",
                          borderRadius: "6px",
                          background: "#E67E22",
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-black w-12 text-right">
                    {payout.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Finance Alerts */}
          <div
            style={{
              display: "flex",
              width: "700px",
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
                    <h3 className="text-sm font-medium text-black mb-1">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-gray-600">{alert.description}</p>
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
                    {alert.button}
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
