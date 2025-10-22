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
} from "lucide-react";

type KPI = {
  title: string;
  value: string;
  meta?: string;
  icon?: React.ReactNode;
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
    title: "Net Revenue (MTD)",
    value: "₦3.2M",
    meta: "-18% MoM",
    icon: <Activity className="w-5 h-5 text-[var(--sidebar-primary)]" />,
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
    title: "Disputes Open",
    value: "2.1%",
    meta: "-0.3% vs last month",
    icon: <TriangleAlert className="w-5 h-5 text-[var(--sidebar-primary)]" />,
  },
  {
    title: "Live Sessions Today",
    value: "28",
    meta: "Total duration: 4.2h",
    icon: <Wifi className="w-5 h-5 text-[var(--sidebar-primary)]" />,
  },
];

function KPIGrid() {
  const [showAdditional, setShowAdditional] = useState(false);

  return (
    <div className="flex items-center relative">
      <div className="flex-1">
        <section
          aria-label="Key metrics"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-md)]"
        >
          {kpis.map((k) => (
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
                    {k.value}
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
            {additionalKpis.map((k) => (
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
                      {k.value}
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
