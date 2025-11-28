"use client";

import React, { useEffect } from "react";
import { KPIGrid } from "@/components/dashboard/kpi-grid";
import { LiveStreamsCard } from "@/components/dashboard/live-streams-card";
import { LogisticsCard } from "@/components/dashboard/logistics-card";
import { AlertsCard } from "@/components/dashboard/alerts-card";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";

export default function Page() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setHeaderTitle("Dashboard"));
  }, [dispatch]);
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
