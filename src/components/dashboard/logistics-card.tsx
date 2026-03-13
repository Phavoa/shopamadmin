import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, AlertCircle, ShoppingBag } from "lucide-react";
import { Order } from "@/api/orderApi";
import { OrderException } from "@/api/orderExceptionsApi";
import { cn } from "@/lib/utils";

type LogisticsCardProps = {
  orders?: Order[];
  exceptions?: OrderException[];
  isLoadingOrders?: boolean;
  isLoadingExceptions?: boolean;
};

function LogisticsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between py-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-16 px-3 rounded-[var(--radius-sm)]" />
        </div>
      ))}
    </div>
  );
}

function EmptyLogistics({ type }: { type: "orders" | "exceptions" }) {
  const isOrders = type === "orders";
  const Icon = isOrders ? Package : AlertCircle;
  const title = isOrders ? "No Orders Today" : "No Exceptions Today";
  const desc = isOrders
    ? "New orders placed today will appear here."
    : "Any order issues reported today will show up here.";

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gray-50/50 rounded-lg border-dashed border border-gray-200">
      <div className="bg-white p-3 rounded-full shadow-sm mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-[200px]">{desc}</p>
    </div>
  );
}

function LogisticsCard({
  orders = [],
  exceptions = [],
  isLoadingOrders,
  isLoadingExceptions,
}: LogisticsCardProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "exceptions">("orders");

  const isLoading =
    activeTab === "orders" ? isLoadingOrders : isLoadingExceptions;
  const items = activeTab === "orders" ? orders : exceptions;

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] h-[400px] flex flex-col">
      <div className="p-[var(--space-lg)] shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold leading-[var(--text-h2-line)] text-black">
            Logistics (Today)
          </h2>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg w-full">
          <button
            onClick={() => setActiveTab("orders")}
            className={cn(
              "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
              activeTab === "orders"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-gray-900",
            )}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("exceptions")}
            className={cn(
              "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
              activeTab === "exceptions"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-gray-900",
            )}
          >
            Exceptions
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-[var(--space-lg)] pt-2">
        {isLoading ? (
          <LogisticsSkeleton />
        ) : items.length === 0 ? (
          <EmptyLogistics type={activeTab} />
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {activeTab === "orders"
              ? (items as Order[]).map((order) => (
                  <li
                    key={order.id}
                    className="py-4 flex items-center justify-between first:pt-2 last:pb-2"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 bg-gray-50 rounded-md border border-gray-100">
                        <ShoppingBag className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-black">
                          {order.orderCode}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {/* Assuming raw format like '500000' for kobo, converting to naira roughly or just showing count */}
                          {order.items[0]?.qty || 0} items • ₦
                          {(parseInt(order.totalKobo) / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="font-normal text-xs capitalize"
                    >
                      {order.status.toLowerCase()}
                    </Badge>
                  </li>
                ))
              : (items as OrderException[]).map((ex) => (
                  <li
                    key={ex.id}
                    className="py-4 flex items-center justify-between first:pt-2 last:pb-2"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 bg-red-50 rounded-md border border-red-100">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-black">
                          {ex.type}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Ref: {ex.orderId?.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="font-normal text-xs capitalize"
                    >
                      {ex.status.toLowerCase().replace("_", " ")}
                    </Badge>
                  </li>
                ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export { LogisticsCard };
