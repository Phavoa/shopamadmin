"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  ShieldAlert,
  History,
  ExternalLink,
  ChevronRight,
  Info,
  BadgeCheck,
  Ban,
} from "lucide-react";
import { SupportConversation } from "@/types/support";
import { format } from "date-fns";
import { useGetOrdersQuery } from "@/api/orderApi";
import { SupportOrderModal } from "./SupportOrderModal";
import { useIssueSuspensionMutation } from "@/api/disciplineApi";
import { useRouter } from "next/navigation";

interface UserDetailsPanelProps {
  chat: SupportConversation;
  onClose?: () => void;
}

export const UserDetailsPanel: React.FC<UserDetailsPanelProps> = ({ chat }) => {
  const user = chat.user;
  const router = useRouter();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [fullViewOrderId, setFullViewOrderId] = useState<string | null>(null);
  const [suspendUser, { isLoading: isSuspending }] = useIssueSuspensionMutation();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-[var(--color-text-secondary)] bg-[var(--color-surface)]">
        <Info size={40} className="mb-4 opacity-20" />
        <p className="text-sm font-medium">
          No customer data available for this session.
        </p>
      </div>
    );
  }

  // Fetch recent orders for this user
  const { data: ordersResponse, isLoading: isLoadingOrders } =
    useGetOrdersQuery(
      {
        buyerId: user.id,
        limit: 5,
        populate: [
          "items",
          "items.product",
          "payments",
          "buyer",
          "seller",
          "seller.user",
          "shipment",
          "shipment.events",
          "checkoutSession",
          "shipment.hub",
        ],
      },
      { skip: !user.id },
    );

  const recentOrders = ordersResponse?.data?.items || [];
  const joinDate = user.createdAt
    ? format(new Date(user.createdAt), "MMM d, yyyy")
    : "Unknown";

  const handleSuspend = async () => {
    const reason = window.prompt("Reason for suspension:");
    if (!reason || !reason.trim()) return;

    try {
      await suspendUser({
        userId: user.id,
        data: { role: "BUYER", durationDays: 365, reason },
      }).unwrap();
      alert("User has been suspended successfully.");
    } catch (e: any) {
      alert("Failed to suspend user: " + (e?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)] border-l border-[var(--border)] overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-300">
      {/* Profile Header */}
      <div className="p-6 text-center border-b border-[var(--border)] bg-gradient-to-b from-[var(--color-muted)] to-white">
        <div className="relative inline-block mb-4">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-20 w-20 rounded-2xl object-cover border-4 border-white shadow-xl shadow-black/5"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--primary)] text-white text-3xl font-black shadow-xl shadow-[var(--primary)]/20">
              {user.firstName?.[0]}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-green-500 border-4 border-white shadow-sm flex items-center justify-center">
            <BadgeCheck size={12} className="text-white" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest mt-0.5">
          Verified Customer
        </p>
      </div>

      {/* Info Sections */}
      <div className="p-6 space-y-8">
        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]/50">
            <User size={12} />
            Contact Information
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-muted)] text-[var(--color-text-secondary)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] transition-all">
                <Mail size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">
                  Email
                </p>
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {user.email}
                </p>
              </div>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-muted)] text-[var(--color-text-secondary)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] transition-all">
                  <Phone size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {user.phone}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-muted)] text-[var(--color-text-secondary)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] transition-all">
                <Calendar size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">
                  Member Since
                </p>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {joinDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Session Metadata */}
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]/50">
            <Clock size={12} />
            Session Intelligence
          </h4>
          <div className="rounded-[var(--radius-lg)] bg-[var(--color-muted)]/50 border border-[var(--border)] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-secondary)]">
                Status
              </span>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm border border-green-100">
                {chat.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-secondary)]">
                Wait Time
              </span>
              <span className="text-xs font-bold text-[var(--color-text-primary)]">
                --:--
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-secondary)]">
                Priority Score
              </span>
              <span className="text-xs font-bold text-blue-600">Premium</span>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]/50">
            <History size={12} />
            Order Insight
          </h4>

          <div className="space-y-2">
            {isLoadingOrders ? (
              <div className="p-4 text-center text-xs text-gray-400">
                Loading orders...
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="p-4 text-center rounded-[var(--radius-md)] border border-dashed border-[var(--border)] text-xs font-medium text-[var(--color-text-secondary)]/60">
                No recent orders found.
              </div>
            ) : (
              recentOrders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const itemsCount =
                  order.items?.reduce(
                    (acc: number, item: any) =>
                      acc + (item.quantity || item.qty || 1),
                    0,
                  ) || 0;
                const lastEvent =
                  order.shipment?.events?.[order.shipment.events.length - 1];

                return (
                  <div
                    key={order.id}
                    className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border)] p-3 hover:border-[var(--primary)]/30 transition-all bg-white"
                  >
                    {/* Header: Clickable to expand */}
                    <div
                      className="cursor-pointer group flex flex-col gap-1"
                      onClick={() =>
                        setExpandedOrderId(isExpanded ? null : order.id)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black tracking-tight text-[var(--color-text-primary)] group-hover:text-[var(--primary)] transition-colors">
                          {order.orderCode || order.id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-[9px] font-bold text-[var(--color-text-secondary)] bg-[var(--color-muted)] px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[var(--color-text-secondary)] font-medium">
                          {format(new Date(order.createdAt), "MMM d, yyyy")}
                        </span>
                        <span className="text-[11px] font-black text-green-600">
                          ₦
                          {(
                            Number((order as any).totalAmount || order.totalKobo || 0) /
                            100
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Expanding Content */}
                    {isExpanded && (
                      <div className="mt-2 pt-3 border-t border-[var(--border)]/60 animate-in slide-in-from-top-2 duration-300 space-y-3">
                        {/* Products Preview */}
                        {order.items && order.items.length > 0 && (
                          <div className="space-y-1.5">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]/50">
                              Products ({itemsCount})
                            </p>
                            <div className="flex flex-col gap-1.5">
                              {order.items.slice(0, 2).map((item: any) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-2"
                                >
                                  {item.product?.imageUrl ||
                                  item.product?.thumbnailUrl ? (
                                    <img
                                      src={
                                        item.product.imageUrl ||
                                        item.product.thumbnailUrl
                                      }
                                      alt="product"
                                      className="h-6 w-6 rounded bg-gray-50 object-cover"
                                    />
                                  ) : (
                                    <div className="h-6 w-6 rounded bg-[var(--color-muted)] border border-[var(--border)]" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-[var(--color-text-primary)] truncate">
                                      {item.product?.name ||
                                        item.title ||
                                        "Product"}
                                    </p>
                                    <p className="text-[9px] text-[var(--color-text-secondary)]">
                                      Qty: {item.quantity || item.qty || 1}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-[9px] font-bold text-[var(--primary)]">
                                  + {order.items.length - 2} more items
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Shipment Info */}
                        {order.shipment && (
                          <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]/50">
                              Logistics Status
                            </p>
                            <div className="rounded bg-blue-50/50 p-2 text-[10px] font-medium text-blue-900 border border-blue-100/50">
                              {order.shipment.status
                                ?.replace(/_/g, " ")
                                .toUpperCase() || "PROCESSING"}
                              {lastEvent && (
                                <p className="text-[9px] text-blue-700/70 mt-0.5 line-clamp-1">
                                  {lastEvent.description || lastEvent.note}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Seller/View Action */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[9px] font-bold text-[var(--color-text-secondary)] truncate flex-1">
                            Seller:{" "}
                            {order.sellerProfile?.businessName ||
                              order.sellerProfile?.shopName ||
                              order.seller?.shopName ||
                              "ShopAm"}
                          </span>
                          <button
                            className="text-[9px] font-black uppercase text-[var(--primary)] hover:underline tracking-wider shrink-0 ml-2 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFullViewOrderId(order.id);
                            }}
                          >
                            View Full Order →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="space-y-4 pt-4">
          <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]/50">
            <ShieldAlert size={12} />
            Account Security
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button 
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[var(--radius-md)] bg-white border border-[var(--border)] group transition-all ${isSuspending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 hover:border-red-100 cursor-pointer'}`}
              onClick={handleSuspend}
              disabled={isSuspending}
            >
              <Ban
                size={18}
                className={`text-[var(--color-text-secondary)] ${!isSuspending && 'group-hover:text-red-500'}`}
              />
              <span className={`text-[10px] font-bold text-[var(--color-text-secondary)] uppercase ${!isSuspending && 'group-hover:text-red-600'}`}>
                {isSuspending ? 'Suspending...' : 'Suspend'}
              </span>
            </button>
            <button 
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-[var(--radius-md)] bg-white border border-[var(--border)] hover:bg-[var(--primary)]/5 hover:border-[var(--primary)]/20 group transition-all cursor-pointer"
              onClick={() => router.push(`/admin-dashboard/buyers/${user.id}`)}
            >
              <ExternalLink
                size={18}
                className="text-[var(--color-text-secondary)] group-hover:text-[var(--primary)]"
              />
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)] group-hover:text-[var(--primary)] uppercase">
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Order Modal Overlay */}
      {fullViewOrderId && (
        <SupportOrderModal
          order={recentOrders.find((o) => o.id === fullViewOrderId)}
          onClose={() => setFullViewOrderId(null)}
        />
      )}
    </div>
  );
};
