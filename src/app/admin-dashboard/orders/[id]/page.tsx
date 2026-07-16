"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetOrderByIdQuery } from "@/api/orderApi";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import { PageWrapper, AnimatedWrapper } from "@/components/shared/AnimatedWrapper";
import {
  ArrowLeft,
  Package,
  User,
  Store,
  Truck,
  Receipt,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Loader2,
  RefreshCw,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const orderId = params?.id as string;

  useEffect(() => {
    dispatch(setHeaderTitle(`Order #${orderId?.slice(0, 8) || ""}`));
  }, [dispatch, orderId]);

  const {
    data: orderResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetOrderByIdQuery(
    {
      id: orderId,
      params: {
        populate: [
          "items",
          "items.product",
          "payments",
          "buyer",
          "seller",
          "seller.user",
          "shipment",
          "shipment.events",
          "shipment.hub",
          "shipment.hub.deliveryZone",
          "checkoutSession",
        ],
      },
    },
    { skip: !orderId }
  );

  const order = orderResponse?.data;

  const getStatusBadge = (status?: string) => {
    const st = (status || "").toLowerCase();
    if (st === "completed" || st === "delivered") {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 font-bold px-3 py-1 text-xs uppercase tracking-wide">
          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
          Completed
        </Badge>
      );
    }
    if (st === "shipped" || st === "in_transit" || st === "out_for_delivery") {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 font-bold px-3 py-1 text-xs uppercase tracking-wide">
          <Truck className="w-3.5 h-3.5 mr-1.5" />
          In Transit
        </Badge>
      );
    }
    if (st === "cancelled" || st === "canceled" || st === "returned" || st === "refunded") {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 font-bold px-3 py-1 text-xs uppercase tracking-wide">
          <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
          {st.charAt(0).toUpperCase() + st.slice(1)}
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 font-bold px-3 py-1 text-xs uppercase tracking-wide">
        <Clock className="w-3.5 h-3.5 mr-1.5" />
        {status || "Processing"}
      </Badge>
    );
  };

  const getEscrowBadge = (escrowStatus?: string) => {
    if (!escrowStatus) return null;
    const st = escrowStatus.toUpperCase();
    if (st === "RELEASED" || st === "FULLY_RELEASED") {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-xs">
          Escrow: Released
        </Badge>
      );
    }
    if (st === "PARTIALLY_RELEASED") {
      return (
        <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 font-semibold text-xs">
          Escrow: Partially Released
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-semibold text-xs">
        Escrow: {escrowStatus.replace(/_/g, " ")}
      </Badge>
    );
  };

  const formatDate = (dateStr?: string) => {
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
      return dateStr || "N/A";
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "AWAITING_SELLER_SHIPMENT":
        return { color: "#E67E22", bg: "#FFE0C5", text: "Awaiting Shipment" };
      case "IN_TRANSIT":
        return { color: "#F813AB", bg: "#FFD6EF", text: "In Transit" };
      case "AT_SHOPAM_HUB":
        return { color: "#E67E22", bg: "#FFE8D4", text: "At Hub" };
      case "OUT_FOR_DELIVERY":
        return { color: "#0915FF", bg: "#DDE0FF", text: "Out for Delivery" };
      case "DELIVERED":
        return { color: "#02B753", bg: "#D1FFE3", text: "Delivered" };
      default:
        return { color: "#6B7280", bg: "#F3F4F6", text: status?.replace(/_/g, " ") || "Unknown" };
    }
  };

  if (isLoading) {
    return (
      <PageWrapper className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 animate-spin text-[#E67E22] mb-3" />
        <p className="text-gray-500 font-medium">Loading order audit details...</p>
      </PageWrapper>
    );
  }

  if (error || !order) {
    return (
      <PageWrapper className="min-h-screen bg-[#F9FAFB] p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-gray-200 text-center my-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            We could not retrieve the order details. It may have been deleted or the ID is invalid.
          </p>
          <Button onClick={() => router.push("/admin-dashboard/orders")} className="bg-[#E67E22] text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </PageWrapper>
    );
  }

  // Profile resolution
  const buyerName = order.buyer
    ? `${order.buyer.firstName || ""} ${order.buyer.lastName || ""}`.trim() || "Unknown Buyer"
    : "Unknown Buyer";
  const buyerImg = order.buyer?.imageUrl;
  
  const shopName = order.sellerProfile?.shopName || order.seller?.shopName || "Unknown Shop";
  const shopLogo = order.sellerProfile?.logoUrl || order.seller?.logoUrl;
  const businessName = order.sellerProfile?.businessName;
  const shopLocation = order.sellerProfile?.locationCity && order.sellerProfile?.locationState 
    ? `${order.sellerProfile.locationCity}, ${order.sellerProfile.locationState}`
    : order.sellerProfile?.locationState || null;
  const sellerUser = order.sellerProfile?.user || order.seller?.user;

  const isPickup = order.deliveryType === "pickup" || (order as any).pickup;

  // Financial calculations
  const subtotalNaira = order.subtotalKobo
    ? Number(order.subtotalKobo) / 100
    : (order.items || []).reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 1), 0);
  const shippingNaira = order.shippingKobo ? Number(order.shippingKobo) / 100 : 0;
  const feesNaira = order.feesKobo ? Number(order.feesKobo) / 100 : 0;
  const commissionNaira = order.commissionKobo ? Number(order.commissionKobo) / 100 : 0;
  const vatNaira = order.vatKobo ? Number(order.vatKobo) / 100 : 0;
  const grandTotalNaira = order.totalAmount || (order.totalKobo ? Number(order.totalKobo) / 100 : subtotalNaira + shippingNaira);

  return (
    <PageWrapper className="min-h-screen bg-[#F8FAFC] p-6 pb-16">
      {/* Top Navigation & Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div className="flex items-start md:items-center gap-4">
          <button
            onClick={() => router.push("/admin-dashboard/orders")}
            className="p-2.5 rounded-xl bg-gray-100/80 border border-gray-200 text-gray-700 hover:text-black hover:bg-gray-200 transition-colors cursor-pointer shrink-0 mt-0.5 md:mt-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Order #{order.orderCode || order.orderNumber || order.id.slice(0, 8)}
              </h1>
              {getStatusBadge(order.status)}
              {getEscrowBadge(order.escrowStatus)}
              {order.source && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-semibold text-xs">
                  Source: {order.source}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                Placed on {formatDate(order.createdAt)}
              </span>
              {order.updatedAt && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Last updated: {formatDate(order.updatedAt)}
                </span>
              )}
              {order.trackingCode && (
                <span className="font-mono text-xs font-bold text-[#E67E22] bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60">
                  Tracking: {order.trackingCode}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin text-[#E67E22]" : ""}`} />
            Refresh Details
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Items & Logistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Card */}
          <Card className="p-6 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#E67E22]">
                  <Package className="w-4 h-4" />
                </div>
                Order Items ({order.items?.length || 0})
              </h2>
              <span className="text-xs font-semibold text-gray-500">
                Total Subtotal: <strong className="text-gray-900 text-sm">₦{subtotalNaira.toLocaleString()}</strong>
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {(order.items || []).map((item) => {
                const prodName = item.product?.title || item.product?.name || (item as any).title || "Product Item";
                const prodImg = item.product?.thumbnailUrl || item.product?.imageUrl || (item as any).thumbnailUrl || (item as any).image || null;
                const unitPrice = item.unitPriceKobo ? Number(item.unitPriceKobo) / 100 : (item.price || 0);
                const qty = item.qty || item.quantity || (item as any).quantity || 1;
                const lineTotal = item.lineTotalKobo ? Number(item.lineTotalKobo) / 100 : unitPrice * qty;
                
                // Item financial stats
                const payoutReleased = item.financial?.payoutReleasedKobo ? Number(item.financial.payoutReleasedKobo) / 100 : 0;
                const payoutPending = item.financial?.payoutPendingKobo ? Number(item.financial.payoutPendingKobo) / 100 : 0;

                return (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      {prodImg ? (
                        <img
                          src={prodImg}
                          alt={prodName}
                          className="w-16 h-16 rounded-xl object-cover border border-gray-200 bg-gray-50 shrink-0 shadow-xs"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center text-[#E67E22] font-bold shrink-0">
                          <Package className="w-7 h-7" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-base">{prodName}</h4>
                          {item.status && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-bold text-[10px]">
                              {item.status}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-md">
                            {item.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 font-medium">
                          <span>Qty: <strong className="text-gray-900">{qty}</strong></span>
                          <span>Unit Price: <strong className="text-gray-900">₦{unitPrice.toLocaleString()}</strong></span>
                          {payoutReleased > 0 && (
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                              Released: ₦{payoutReleased.toLocaleString()}
                            </span>
                          )}
                          {payoutPending > 0 && (
                            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                              Pending: ₦{payoutPending.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:self-center bg-gray-50/80 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                      <div className="text-xs text-gray-400 font-medium mb-0.5 sm:hidden">Line Total</div>
                      <div className="font-black text-gray-900 text-base">
                        ₦{lineTotal.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 font-medium mt-0.5">
                        {qty} × ₦{unitPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Delivery & Address Snapshots Card */}
          <Card className="p-6 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Truck className="w-4 h-4" />
                </div>
                Logistics & Address Snapshots
              </h2>
              <Badge variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-200 font-semibold">
                {isPickup ? "Pickup Hub" : "Home Delivery"}
              </Badge>
            </div>

            {/* Shipment Status Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200/60 mb-6 text-sm">
              <div>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-0.5">Carrier</span>
                <span className="font-bold text-gray-900">{order.shipment?.carrier || "Standard Logistics"}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-0.5">Tracking Number</span>
                <span className="font-mono text-xs font-bold text-[#E67E22] bg-white px-2.5 py-1 rounded border border-gray-200">
                  {order.shipment?.trackingNumber || order.trackingCode || "Pending Assignment"}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-0.5">Delivery Status</span>
                <span className="font-bold text-gray-900">{order.shipment?.status || order.status || "In Progress"}</span>
              </div>
            </div>

            {/* Addresses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup / From Snapshot */}
              <div className="p-4 rounded-xl border border-gray-200/80 bg-white">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    Ship From (Pickup Location)
                  </h3>
                  {order.shipFromSnapshot?.deliveryZone?.name && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-bold text-[10px]">
                      {order.shipFromSnapshot.deliveryZone.name}
                    </Badge>
                  )}
                </div>
                {order.shipFromSnapshot ? (
                  <div className="space-y-1.5 text-sm">
                    <p className="font-bold text-gray-900">{order.shipFromSnapshot.fullName || shopName}</p>
                    {order.shipFromSnapshot.phone && (
                      <p className="text-xs text-gray-600 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {order.shipFromSnapshot.phone}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 leading-relaxed pt-1">
                      {[
                        order.shipFromSnapshot.line1,
                        order.shipFromSnapshot.line2,
                        order.shipFromSnapshot.city,
                        order.shipFromSnapshot.state,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {order.shipFromSnapshot.postalCode && (
                      <p className="text-xs text-gray-400 font-mono">Postal Code: {order.shipFromSnapshot.postalCode}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic py-2">No pickup address snapshot recorded.</p>
                )}
              </div>

              {/* Delivery / To Snapshot */}
              <div className="p-4 rounded-xl border border-gray-200/80 bg-white">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E67E22]" />
                    Ship To (Delivery Destination)
                  </h3>
                  {order.shipToSnapshot?.deliveryZone?.name && (
                    <Badge variant="secondary" className="bg-orange-50 text-[#E67E22] font-bold text-[10px]">
                      {order.shipToSnapshot.deliveryZone.name}
                    </Badge>
                  )}
                </div>
                {order.shipToSnapshot ? (
                  <div className="space-y-1.5 text-sm">
                    <p className="font-bold text-gray-900">{order.shipToSnapshot.fullName || buyerName}</p>
                    {order.shipToSnapshot.phone && (
                      <p className="text-xs text-gray-600 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {order.shipToSnapshot.phone}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 leading-relaxed pt-1">
                      {[
                        order.shipToSnapshot.line1,
                        order.shipToSnapshot.line2,
                        order.shipToSnapshot.city,
                        order.shipToSnapshot.state,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {order.shipToSnapshot.postalCode && (
                      <p className="text-xs text-gray-400 font-mono">Postal Code: {order.shipToSnapshot.postalCode}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic py-2">No delivery address snapshot recorded.</p>
                )}
              </div>
            </div>

            {/* Shipment Events Timeline */}
            {order.shipment?.events && order.shipment.events.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Shipment Events Timeline
                </h3>
                <div className="relative pl-6 border-l border-gray-200/80 space-y-5">
                  {order.shipment.events.map((event: any) => {
                    const statusColor = getEventStatusColor(event.status);
                    return (
                      <div key={event.id} className="relative">
                        {/* Timeline dot */}
                        <span
                          className="absolute -left-[30px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 ring-4 ring-white"
                          style={{ borderColor: statusColor.color }}
                        />
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                          <div>
                            <p
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-1 font-mono"
                              style={{ color: statusColor.color, backgroundColor: statusColor.bg }}
                            >
                              {statusColor.text}
                            </p>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">
                              {event.note || event.description}
                            </p>
                          </div>
                          <span className="text-[10px] text-gray-400 font-semibold shrink-0 pt-0.5">
                            {formatDate(event.createdAt || event.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Col: Financial Audit, Buyer, Seller */}
        <div className="space-y-6">
          {/* Financial Breakdown Card (With Commission & VAT Audit) */}
          <Card className="p-6 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Receipt className="w-4 h-4" />
                </div>
                Financial Audit
              </h2>
              <div className="flex items-center gap-1">
                {order.isPaid && (
                  <Badge className="bg-emerald-100 text-emerald-800 font-bold text-[10px]">Paid</Badge>
                )}
                {order.isDisbursed ? (
                  <Badge className="bg-blue-100 text-blue-800 font-bold text-[10px]">Disbursed</Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500 font-medium text-[10px]">Pending Payout</Badge>
                )}
              </div>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between py-1 text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">₦{subtotalNaira.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1 text-gray-600">
                <span>Delivery & Shipping</span>
                <span className="font-semibold text-gray-900">₦{shippingNaira.toLocaleString()}</span>
              </div>

              {/* Platform Commission (Amount Taken from Task/Order) */}
              {commissionNaira > 0 && (
                <div className="flex justify-between py-2 px-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-emerald-800 my-1 font-medium">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Platform Commission</span>
                  </div>
                  <span className="font-extrabold">₦{commissionNaira.toLocaleString()}</span>
                </div>
              )}

              {/* Platform Fees */}
              {feesNaira > 0 && (
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Processing / Platform Fees</span>
                  <span className="font-semibold text-gray-900">₦{feesNaira.toLocaleString()}</span>
                </div>
              )}

              {/* Seller VAT Deduction Spotlight */}
              {vatNaira > 0 && (
                <div className="flex justify-between py-2 px-3 bg-orange-50/70 border border-orange-200/80 rounded-xl text-[#E67E22] my-1" title="Deducted from Seller Payout">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CreditCard className="w-4 h-4" />
                    <span>Seller VAT Deduction</span>
                  </div>
                  <span className="font-extrabold">-₦{vatNaira.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between pt-3.5 border-t border-gray-200 text-base font-black text-gray-900">
                <span>Grand Total</span>
                <span className="text-[#E67E22] text-lg">₦{grandTotalNaira.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Buyer Profile Card */}
          <Card className="p-6 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                  <User className="w-4 h-4" />
                </div>
                Buyer Profile
              </h2>
              {order.buyer && (
                <Button
                  onClick={() => router.push(`/admin-dashboard/buyers/${order.buyer.id}`)}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-[#E67E22] hover:text-[#d35400] hover:bg-orange-50 p-1.5 h-auto cursor-pointer font-bold"
                >
                  Profile <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              {buyerImg ? (
                <img src={buyerImg} alt={buyerName} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-base">
                  {buyerName.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="font-bold text-gray-900 text-base">{buyerName}</h4>
                <span className="text-[11px] text-gray-400 font-mono block">ID: {order.buyer?.id?.slice(0, 10) || "N/A"}...</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-600 font-medium">
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{order.buyer?.email || "No email recorded"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{order.buyer?.phone || "No phone recorded"}</span>
              </div>
            </div>
          </Card>

          {/* Seller Shop Card */}
          <Card className="p-6 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                  <Store className="w-4 h-4" />
                </div>
                Seller Shop
              </h2>
              {order.sellerProfile?.userId || order.seller?.id ? (
                <Button
                  onClick={() => router.push(`/admin-dashboard/sellers/${order.sellerProfile?.userId || order.seller?.id}`)}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-[#E67E22] hover:text-[#d35400] hover:bg-orange-50 p-1.5 h-auto cursor-pointer font-bold"
                >
                  Shop <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              ) : null}
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              {shopLogo ? (
                <img src={shopLogo} alt={shopName} className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-xs" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#E67E22] font-bold text-base">
                  <Store className="w-6 h-6" />
                </div>
              )}
              <div>
                <h4 className="font-bold text-gray-900 text-base">{shopName}</h4>
                {businessName && <span className="text-xs text-gray-500 block font-medium">{businessName}</span>}
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600 font-medium">
              {shopLocation && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{shopLocation}</span>
                </div>
              )}
              <div className="text-[11px] text-gray-400 font-mono pt-1 border-t border-gray-100">
                Seller ID: {order.sellerProfile?.userId || order.seller?.id || "N/A"}
              </div>

              {sellerUser && (
                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                  <div className="font-bold text-gray-900 mb-1 text-xs">Seller Contact Details</div>
                  <div className="flex items-center gap-2.5">
                    <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{`${sellerUser.firstName || ""} ${sellerUser.lastName || ""}`.trim()}</span>
                  </div>
                  {sellerUser.email && (
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{sellerUser.email}</span>
                    </div>
                  )}
                  {sellerUser.phone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{sellerUser.phone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
