"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetOrdersQuery, type Order } from "@/api/orderApi";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import { PageWrapper, AnimatedWrapper } from "@/components/shared/AnimatedWrapper";
import {
  Package,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Truck,
  Store,
  User,
  Loader2,
  RefreshCw,
  Receipt,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TabStatus = "ALL" | "PENDING" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED";
type DeliveryFilter = "ALL" | "PICKUP" | "DELIVERY";

export default function OrdersListPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<TabStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [cursor, setCursor] = useState<{ after?: string; before?: string }>({});

  useEffect(() => {
    dispatch(setHeaderTitle("Orders Management Hub"));
  }, [dispatch]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
      setCursor({});
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch orders
  const {
    data: ordersResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetOrdersQuery({
    limit: 30,
    populate: ["buyer", "seller", "shipment", "items", "items.product"],
    ...(debouncedSearch && { q: debouncedSearch }),
    ...(deliveryFilter === "PICKUP" && { pickup: true }),
    ...(deliveryFilter === "DELIVERY" && { delivery: true }),
    ...cursor,
  });

  const rawOrders = ordersResponse?.data?.items || [];

  // Filter by status tab locally if needed to ensure precise categorization
  const filteredOrders = useMemo(() => {
    if (activeTab === "ALL") return rawOrders;
    return rawOrders.filter((order) => {
      const st = (order.status || "").toLowerCase();
      if (activeTab === "PENDING") {
        return st === "pending" || st === "processing";
      }
      if (activeTab === "IN_TRANSIT") {
        return st === "shipped" || st === "in_transit" || st === "out_for_delivery";
      }
      if (activeTab === "COMPLETED") {
        return st === "completed" || st === "delivered";
      }
      if (activeTab === "CANCELLED") {
        return st === "cancelled" || st === "canceled" || st === "returned" || st === "refunded";
      }
      return true;
    });
  }, [rawOrders, activeTab]);

  // Calculate high-level KPIs across fetched orders
  const kpis = useMemo(() => {
    const total = rawOrders.length;
    let completedCount = 0;
    let totalRevenue = 0;
    let totalVatCollectedKobo = 0;

    rawOrders.forEach((order) => {
      const st = (order.status || "").toLowerCase();
      if (st === "completed" || st === "delivered") {
        completedCount += 1;
        totalRevenue += Number(order.totalAmount) || 0;
      }
      if (order.vatKobo) {
        totalVatCollectedKobo += Number(order.vatKobo) || 0;
      }
    });

    const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    const vatNaira = Math.round(totalVatCollectedKobo / 100);

    return {
      total,
      completedCount,
      totalRevenue,
      completionRate,
      vatNaira,
    };
  }, [rawOrders]);

  const handleNextPage = () => {
    const dataObj = ordersResponse?.data as any;
    if (dataObj?.hasNext && dataObj?.nextCursor) {
      setCurrentPage((prev) => prev + 1);
      setCursor({ after: dataObj.nextCursor, before: undefined });
    }
  };

  const handlePrevPage = () => {
    const dataObj = ordersResponse?.data as any;
    if (dataObj?.hasPrev && dataObj?.prevCursor) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
      setCursor({ before: dataObj.prevCursor, after: undefined });
    }
  };

  const getStatusBadge = (status: string) => {
    const st = (status || "").toLowerCase();
    if (st === "completed" || st === "delivered") {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 font-semibold px-2.5 py-1">
          <CheckCircle className="w-3.5 h-3.5 mr-1" />
          Completed
        </Badge>
      );
    }
    if (st === "shipped" || st === "in_transit" || st === "out_for_delivery") {
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 font-semibold px-2.5 py-1">
          <Truck className="w-3.5 h-3.5 mr-1" />
          In Transit
        </Badge>
      );
    }
    if (st === "cancelled" || st === "canceled" || st === "returned" || st === "refunded") {
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 font-semibold px-2.5 py-1">
          <AlertCircle className="w-3.5 h-3.5 mr-1" />
          {st.charAt(0).toUpperCase() + st.slice(1)}
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 font-semibold px-2.5 py-1">
        <Clock className="w-3.5 h-3.5 mr-1" />
        Processing
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-[#F9FAFB] p-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-7 h-7 text-[#E67E22]" />
            Orders Management Hub
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor all marketplace orders, inspect shipments, and audit VAT tax collections in real time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-[#E67E22]" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <AnimatedWrapper animation="fadeIn" delay={0.1}>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{kpis.total.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#E67E22]">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </AnimatedWrapper>

        <AnimatedWrapper animation="fadeIn" delay={0.15}>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed Revenue</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                ₦{kpis.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </AnimatedWrapper>

        <AnimatedWrapper animation="fadeIn" delay={0.2}>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Seller VAT Deducted</p>
              <h3 className="text-2xl font-extrabold text-[#E67E22] mt-1">
                ₦{kpis.vatNaira.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-100/60 flex items-center justify-center text-[#E67E22]">
              <Receipt className="w-6 h-6" />
            </div>
          </div>
        </AnimatedWrapper>

        <AnimatedWrapper animation="fadeIn" delay={0.25}>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completion Rate</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{kpis.completionRate}%</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </AnimatedWrapper>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-gray-100/80 p-1.5 rounded-xl">
            {(["ALL", "PENDING", "IN_TRANSIT", "COMPLETED", "CANCELLED"] as TabStatus[]).map((tab) => {
              const labelMap: Record<TabStatus, string> = {
                ALL: "All Orders",
                PENDING: "Processing",
                IN_TRANSIT: "In Transit",
                COMPLETED: "Completed",
                CANCELLED: "Cancelled/Returned",
              };
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#E67E22] shadow-sm font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  {labelMap[tab]}
                </button>
              );
            })}
          </div>

          {/* Search and Delivery Type */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search order #, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-[#E67E22] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-500 hidden sm:block" />
              <select
                value={deliveryFilter}
                onChange={(e) => {
                  setDeliveryFilter(e.target.value as DeliveryFilter);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-36 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              >
                <option value="ALL">All Delivery</option>
                <option value="DELIVERY">Delivery Only</option>
                <option value="PICKUP">Pickup Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#E67E22] mb-3" />
            <p className="text-gray-500 font-medium text-sm">Loading orders marketplace...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="text-base font-bold text-gray-900">Failed to load orders</h3>
            <p className="text-sm text-gray-500 max-w-md mt-1 mb-4">
              There was a problem connecting to the backend service. Please check your connection or try again.
            </p>
            <Button onClick={() => refetch()} className="bg-[#E67E22] hover:bg-[#d35400] text-white">
              Try Again
            </Button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <Package className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
            <p className="text-sm text-gray-500 max-w-md mt-1">
              No orders matched your selected status tab or search filter. Try adjusting your search keywords.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Order Details</th>
                  <th className="py-4 px-6">Buyer</th>
                  <th className="py-4 px-6">Seller Shop</th>
                  <th className="py-4 px-6">Delivery Type</th>
                  <th className="py-4 px-6">Grand Total</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredOrders.map((order) => {
                  const buyerName = order.buyer
                    ? `${order.buyer.firstName || ""} ${order.buyer.lastName || ""}`.trim() || "Unknown Buyer"
                    : "Unknown Buyer";
                  const shopName = order.seller?.shopName || "Unknown Shop";
                  const isPickup = order.deliveryType === "pickup" || (order as any).pickup;
                  const vatKoboNum = Number(order.vatKobo || 0);

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-orange-50/20 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/admin-dashboard/orders/${order.id}`)}
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900 group-hover:text-[#E67E22] transition-colors">
                          #{order.orderNumber || order.id.slice(0, 8)}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{buyerName}</div>
                            <div className="text-xs text-gray-400">{order.buyer?.phone || order.buyer?.email || "No contact"}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-800">{shopName}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        {isPickup ? (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-medium">
                            Pickup Hub
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                            Home Delivery
                          </Badge>
                        )}
                        <div className="text-xs text-gray-400 mt-1">{order.items?.length || 0} item(s)</div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-extrabold text-gray-900">
                          ₦{(order.totalAmount || 0).toLocaleString()}
                        </div>
                        {vatKoboNum > 0 && (
                          <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-[#E67E22]" title="Deducted from Seller Payout">
                            Seller VAT: -₦{(vatKoboNum / 100).toLocaleString()}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">{getStatusBadge(order.status)}</td>

                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          onClick={() => router.push(`/admin-dashboard/orders/${order.id}`)}
                          size="sm"
                          variant="outline"
                          className="border-gray-200 text-gray-700 hover:bg-[#E67E22] hover:text-white hover:border-[#E67E22] transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          Inspect
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!isLoading && filteredOrders.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-xs font-medium text-gray-500">
              Page <span className="font-bold text-gray-900">{currentPage}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePrevPage}
                disabled={!((ordersResponse?.data as any)?.hasPrev)}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs border-gray-200 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                onClick={handleNextPage}
                disabled={!((ordersResponse?.data as any)?.hasNext)}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs border-gray-200 disabled:opacity-40 cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
