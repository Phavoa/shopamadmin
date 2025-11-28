"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Shield, CreditCard, Package, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import {
  PageWrapper,
  StaggerContainer,
  SlideUp,
  Interactive,
} from "@/components/shared/AnimatedWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setHeaderTitle("Settings"));
  }, [dispatch]);

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
    {
      icon: User,
      title: "Admin Management",
      items: ["Admin", "Add, Modify & Edit Admins"],
      route: "/admin-dashboard/settings/admin",
    },
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#F9FAFB]">
        {/* Cards Grid */}
        <div className="px-6 py-8">
          <StaggerContainer staggerDelay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settingsCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <SlideUp key={index} delay={index * 0.1}>
                    <Interactive effect="lift">
                      <Card
                        className="min-h-64 cursor-pointer transition-all duration-200 shadow-none"
                        onClick={() => router.push(card.route)}
                      >
                        <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#FFE9D5] flex items-center justify-center">
                            <Icon className="w-5 h-5 text-[#E67E22]" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-black">
                            {card.title}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="flex-1">
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
                        </CardContent>
                      </Card>
                    </Interactive>
                  </SlideUp>
                );
              })}
            </div>
          </StaggerContainer>
        </div>
      </div>
    </PageWrapper>
  );
}
