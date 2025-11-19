"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Bell, Shield, CreditCard, Package } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const settingsCards = [
    {
      icon: Bell,
      title: "Notifications",
      items: [
        "Email & SMS templates",
        "Buyer and seller updates",
        "Livestream alerts and reminders",
      ],
      route: "/admin-dashboard/settings/notifications",
    },
    {
      icon: Shield,
      title: "Security & Audit",
      items: [
        "KYC required for sellers",
        "2FA enforcement and sessions",
        "Password policy and lockouts",
        "Change history trail",
      ],
      route: "/admin-dashboard/settings/security",
    },
    {
      icon: CreditCard,
      title: "Payments & Wallet",
      items: [
        "Gateways: Paystack, Flutterwave",
        "Escrow rules and sudo release",
        "Livestream provider toggles",
        "Webhooks and API keys",
      ],
      route: "/admin-dashboard/settings/payments",
    },
    {
      icon: Package,
      title: "Products",
      items: ["Product Categories", "Delete Products"],
      route: "/admin-dashboard/settings/products",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">Settings</h1>
      </div>

      {/* Cards Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                onClick={() => router.push(card.route)}
                style={{
                  padding: "20px",
                  borderRadius: "18px",
                  border: "0.3px solid rgba(0, 0, 0, 0.20)",
                  background: "#FFF",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                className="hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: "#FFE9D5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon className="w-5 h-5 text-[#E67E22]" />
                  </div>
                  <h2 className="text-lg font-semibold text-black">
                    {card.title}
                  </h2>
                </div>

                <ul className="space-y-2">
                  {card.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="mt-1.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}