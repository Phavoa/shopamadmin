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
import { useGetSystemAlertsQuery } from "@/api/adminApi";

export default function Page() {
  const dispatch = useDispatch();
  const [trigger, { data: liveStreamsData, isLoading: isLiveStreamsLoading }] =
    useLazyGetLiveStreamsQuery();

  const { data: ordersData, isLoading: isLoadingOrders } = useGetOrdersQuery({
    limit: 100,
    sortBy: "createdAt",
    sortDir: "desc",
    populate: ["buyer", "seller", "shipment", "items", "items.product"],
  });

  const { data: exceptionsData, isLoading: isLoadingExceptions } =
    useGetOrderExceptionsQuery({
      params: {
        limit: 100,
        sortBy: "createdAt",
        sortDir: "desc",
        populate: ["buyer", "seller", "order"],
      },
    });

  const { data: alertsData, isLoading: isLoadingAlerts } =
    useGetSystemAlertsQuery({
      limit: 5,
      isResolved: false,
    });

  const todayOrders = useMemo(() => {
    if (!ordersData?.data?.items) return [];

    // We filter for items created within the last 24 hours to be more inclusive of "recent" activity
    // or we can stick to "calendar today". Let's use calendar today but ensure we have data.
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const items = ordersData.data.items.filter(
      (order) => new Date(order.createdAt) >= startOfDay,
    );

    // If no orders today, show the most recent ones (e.g. top 5) to avoid empty state
    return items.length > 0 ? items : ordersData.data.items.slice(0, 5);
  }, [ordersData]);

  const todayExceptions = useMemo(() => {
    if (!exceptionsData?.data?.items) return [];

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const items = exceptionsData.data.items.filter(
      (ex) => new Date(ex.createdAt) >= startOfDay,
    );

    // If no exceptions today, show the most recent ones (e.g. top 5) to avoid empty state
    return items.length > 0 ? items : exceptionsData.data.items.slice(0, 5);
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
          <AlertsCard
            alerts={alertsData?.data?.items}
            isLoading={isLoadingAlerts}
          />
        </section>
      </main>
    </div>
  );
}
