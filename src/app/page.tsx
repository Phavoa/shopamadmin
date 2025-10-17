"use client";

import React from "react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { KPIGrid } from "@/components/dashboard/kpi-grid";
import { LiveStreamsCard } from "@/components/dashboard/live-streams-card";
import { LogisticsCard } from "@/components/dashboard/logistics-card";
import { AlertsCard } from "@/components/dashboard/alerts-card";

export default function Page() {
  return (
    <div className="min-h-screen bg-[var(--background)] ">
      <main className="space-y-6  pt-6">
        <section aria-labelledby="top-kpis">
          <KPIGrid />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--card-gap)]">
          <div className="lg:col-span-2">
            <LiveStreamsCard />
          </div>

          <div>
            <LogisticsCard />
          </div>
        </section>

        <section>
          <AlertsCard />
        </section>
      </main>
    </div>
  );
}
