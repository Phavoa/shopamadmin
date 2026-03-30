"use client";

import React from "react";
import { format } from "date-fns";
import { 
  X, 
  Package, 
  MapPin, 
  CreditCard,
  User,
  Store,
  Truck
} from "lucide-react";

interface SupportOrderModalProps {
  order: any;
  onClose: () => void;
}

export const SupportOrderModal: React.FC<SupportOrderModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const totalKobo = Number(order.totalAmount || order.totalKobo || 0);
  const subTotalKobo = Number(order.subtotalKobo || 0);
  const shippingKobo = Number(order.shippingKobo || 0);
  
  const items = order.items || [];
  const shipment = order.shipment;
  const buyer = order.buyer;
  const seller = order.sellerProfile || order.seller;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-[var(--color-text-primary)]">
              {order.orderCode || "Order Details"}
            </h2>
            <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-0.5">
              Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-800">
              {order.status}
            </span>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Top Row: Buyer & Seller */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buyer Info */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-white space-y-3">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                <User size={14} /> Customer
              </h3>
              {buyer ? (
                <div className="flex items-center gap-3">
                  {buyer.imageUrl ? (
                    <img src={buyer.imageUrl} alt="Buyer" className="w-10 h-10 rounded-full object-cover border border-[var(--border)]" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                      {buyer.firstName?.[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-[var(--color-text-primary)] truncate">{buyer.firstName} {buyer.lastName}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] truncate">{buyer.email}</p>
                    {buyer.phone && <p className="text-xs text-[var(--color-text-secondary)]">{buyer.phone}</p>}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No buyer details available.</p>
              )}
            </div>

            {/* Seller Info */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-white space-y-3">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                <Store size={14} /> Shop
              </h3>
              {seller ? (
                <div className="flex items-center gap-3">
                  {seller.logoUrl ? (
                    <img src={seller.logoUrl} alt="Seller" className="w-10 h-10 rounded-xl object-cover border border-[var(--border)]" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
                      {seller.shopName?.[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-[var(--color-text-primary)] truncate">{seller.shopName || seller.businessName}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] capitalize">{seller.locationCity}, {seller.locationState}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No seller details available.</p>
              )}
            </div>
          </div>

          {/* Logistics & Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-white space-y-3">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                <MapPin size={14} /> Delivery Address
              </h3>
              {order.shipToSnapshot ? (
                <div className="text-sm space-y-1 text-[var(--color-text-secondary)]">
                  <p className="font-bold text-[var(--color-text-primary)]">{order.shipToSnapshot.fullName}</p>
                  <p>{order.shipToSnapshot.line1}</p>
                  {order.shipToSnapshot.line2 && <p>{order.shipToSnapshot.line2}</p>}
                  <p>{order.shipToSnapshot.city}, {order.shipToSnapshot.state}</p>
                  <p>{order.shipToSnapshot.phone}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No shipping address recorded.</p>
              )}
            </div>

            {/* Tracking & Shipment */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-white space-y-3">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                <Truck size={14} /> Logistics Status
              </h3>
              {shipment ? (
                <div className="space-y-3">
                  <div className="inline-flex items-center px-2.5 py-1 rounded bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide">
                    {shipment.status.replace(/_/g, ' ')}
                  </div>
                  {shipment.events && shipment.events.length > 0 && (
                    <div className="pl-3 border-l-2 border-blue-100 space-y-3 mt-3">
                      {shipment.events.slice(-3).reverse().map((event: any, i: number) => (
                         <div key={event.id} className="relative">
                           <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-blue-400 ring-4 ring-white" />
                           <p className="text-xs font-bold text-[var(--color-text-primary)]">{event.status.replace(/_/g, ' ')}</p>
                           <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mt-0.5">{event.description || event.note}</p>
                           <p className="text-[10px] text-gray-400 mt-0.5">{format(new Date(event.timestamp || event.createdAt), "MMM d, h:mm a")}</p>
                         </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Awaiting tracking initialization.</p>
              )}
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
              <Package size={14} /> Order Items
            </h3>
            <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-white">
              <div className="divide-y divide-[var(--border)]">
                {items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 p-4 hover:bg-gray-50 transition-colors">
                    {item.product?.thumbnailUrl || item.thumbnailUrl ? (
                      <img 
                        src={item.product?.thumbnailUrl || item.thumbnailUrl} 
                        alt="Product" 
                        className="w-16 h-16 rounded-lg object-cover border border-[var(--border)]"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Package size={24} className="text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="font-bold text-[var(--color-text-primary)] text-sm line-clamp-1">
                        {item.product?.name || item.title || "Product"}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                        Qty: {item.quantity || item.qty || 1}
                      </p>
                    </div>
                    <div className="text-right flex flex-col justify-center gap-1.5">
                      <span className="font-black text-[var(--color-text-primary)]">
                        ₦{(Number(item.lineTotalKobo || item.unitPriceKobo || 0) / 100).toLocaleString()}
                      </span>
                      {item.fulfillment?.status && (
                        <span className="text-[10px] uppercase font-bold text-gray-500">
                          {item.fulfillment.status.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-full max-w-sm rounded-xl border border-[var(--border)] p-4 bg-gray-50/50 space-y-3">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 pb-2 border-b border-[var(--border)]">
                <CreditCard size={14} /> Payment Summary
              </h3>
              <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
                <span>Subtotal</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  ₦{(subTotalKobo / 100).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
                <span>Shipping</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  ₦{(shippingKobo / 100).toLocaleString()}
                </span>
              </div>
              <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center">
                <span className="font-bold text-[var(--color-text-primary)]">Total</span>
                <span className="text-lg font-black text-green-600">
                  ₦{(totalKobo / 100).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border)] bg-white flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-[var(--primary)] text-white font-bold tracking-wide hover:bg-opacity-90 transition-all shadow-sm"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
