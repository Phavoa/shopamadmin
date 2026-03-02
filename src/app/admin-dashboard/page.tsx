"use client";

import React, { useEffect, useMemo } from "react";
import { KPIGrid } from "@/components/dashboard/kpi-grid";
import { LiveStreamsCard } from "@/components/dashboard/live-streams-card";
import { LogisticsCard } from "@/components/dashboard/logistics-card";
import { AlertsCard } from "@/components/dashboard/alerts-card";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";

import { useLazyGetLiveStreamsQuery } from "@/api/liveStreamApi";
import { useGetOrdersQuery } from "@/api/orderApi";
import { useGetOrderExceptionsQuery } from "@/api/orderExceptionsApi";

export default function Page() {
  const dispatch = useDispatch();
  const [trigger, { data: liveStreamsData, isLoading: isLiveStreamsLoading }] =
    useLazyGetLiveStreamsQuery();

  const { data: ordersData, isLoading: isLoadingOrders } = useGetOrdersQuery({
    limit: 100,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  const { data: exceptionsData, isLoading: isLoadingExceptions } =
    useGetOrderExceptionsQuery({
      params: { limit: 100, sortBy: "createdAt", sortDir: "desc" },
    });

  const todayOrders = useMemo(() => {
    if (!ordersData?.data?.items) return [];
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return ordersData.data.items.filter(
      (order) => new Date(order.createdAt) >= startOfDay,
    );
  }, [ordersData]);

  const todayExceptions = useMemo(() => {
    if (!exceptionsData?.data?.items) return [];
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return exceptionsData.data.items.filter(
      (ex) => new Date(ex.createdAt) >= startOfDay,
    );
  }, [exceptionsData]);

  useEffect(() => {
    dispatch(setHeaderTitle("Dashboard"));
    trigger({ status: "LIVE", populate: ["seller", "tier"] });
  }, [dispatch, trigger]);

  return (
    <div className="min-h-screen bg-[var(--background)] ">
      <main className="space-y-6  pt-6">
        <section aria-labelledby="top-kpis">
          <KPIGrid />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--card-gap)]">
          <div className="lg:col-span-2">
            <LiveStreamsCard
              streams={liveStreamsData?.data.items}
              isLoading={isLiveStreamsLoading}
            />
          </div>

          <div>
            <LogisticsCard
              orders={todayOrders}
              exceptions={todayExceptions}
              isLoadingOrders={isLoadingOrders}
              isLoadingExceptions={isLoadingExceptions}
            />
          </div>
        </section>

        <section>
          <AlertsCard />
        </section>
      </main>
    </div>
  );
}
