import React from "react";
import { Card } from "@/components/ui/card";
import { DollarSign, Box, Activity, Wifi, Radio, Package } from "lucide-react";

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

function KPIGrid() {
  return (
    <section
      aria-label="Key metrics"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-md)]"
    >
      {kpis.map((k) => (
        <div
          key={k.title}
          className="p-5  rounded-2xl border border-[var(--border)] bg-[var(--card)]"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[var(--text-caption-size)] font-[var(--text-caption-weight)] leading-[var(--text-caption-line)] text-[var(--muted-foreground)]">
                {k.title}
              </h3>
              <div className="mt-4 text-[var(--text-display-lg-size)] font-[var(--text-display-lg-weight)] leading-[var(--text-display-lg-line)] text-[var(--foreground)]">
                {k.value}
              </div>
              {k.meta && (
                <div className="text-[var(--text-caption-size)] font-[var(--text-caption-weight)] leading-[var(--text-caption-line)] text-[var(--muted-foreground)] mt-1">
                  {k.meta}
                </div>
              )}
            </div>
            <div className="text-[var(--muted-foreground)]">{k.icon}</div>
          </div>
        </div>
      ))}
    </section>
  );
}

export { KPIGrid };
