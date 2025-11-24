"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Wifi,
  Users,
  Settings,
  LogIn,
  LayoutGrid,
  ChevronDown,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Calendar,
  Eye,
  Trophy,
  DollarSign,
  LayoutGrid as OverviewIcon,
  CreditCard,
  Wrench,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

function Sidebar() {
  const [isSellersOpen, setIsSellersOpen] = useState(false);
  const [isLivestreamOpen, setIsLivestreamOpen] = useState(false);
  const [isBuyersOpen, setIsBuyersOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const [activeMainItem, setActiveMainItem] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin-dashboard") {
      setActiveMainItem("dashboard");
      setActiveSubItem(null);
    } else if (pathname.startsWith("/admin-dashboard/livestream")) {
      setActiveMainItem("livestream");
      setIsLivestreamOpen(true);
      if (pathname === "/admin-dashboard/livestream/slots")
        setActiveSubItem("slots");
      else if (pathname === "/admin-dashboard/livestream/monitoring")
        setActiveSubItem("monitoring");
      else if (pathname === "/admin-dashboard/livestream/tiers")
        setActiveSubItem("tiers");
      else setActiveSubItem(null);
    } else if (pathname.startsWith("/admin-dashboard/sellers")) {
      setActiveMainItem("sellers");
      setIsSellersOpen(true);
      if (pathname === "/admin-dashboard/sellers/list")
        setActiveSubItem("list");
      else if (pathname === "/admin-dashboard/sellers/verification")
        setActiveSubItem("verification");
      else if (pathname === "/admin-dashboard/sellers/strikes")
        setActiveSubItem("strikes");
      else if (pathname === "/admin-dashboard/sellers/appeals")
        setActiveSubItem("appeals");
    } else if (pathname.startsWith("/admin-dashboard/buyers")) {
      setActiveMainItem("buyers");
      setIsBuyersOpen(true);
      if (pathname === "/admin-dashboard/buyers/list")
        setActiveSubItem("buyers-list");
      else if (pathname === "/admin-dashboard/buyers/strikes")
        setActiveSubItem("buyers-strikes");
      else if (pathname === "/admin-dashboard/buyers/appeals")
        setActiveSubItem("buyers-appeals");
      else setActiveSubItem(null);
    } else if (pathname.startsWith("/admin-dashboard/finance")) {
      setActiveMainItem("finance");
      setIsFinanceOpen(true);
      if (pathname === "/admin-dashboard/finance/overview")
        setActiveSubItem("finance-overview");
      else if (pathname === "/admin-dashboard/finance/payout-management")
        setActiveSubItem("finance-payout");
      else if (pathname === "/admin-dashboard/finance/fee-configuration")
        setActiveSubItem("finance-fee");
      else if (pathname === "/admin-dashboard/finance/revenue-reports")
        setActiveSubItem("finance-revenue");
      else setActiveSubItem(null);
    } else if (pathname.startsWith("/admin-dashboard/reports")) {
      setActiveMainItem("reports");
      setIsReportsOpen(true);
      if (pathname === "/admin-dashboard/reports/weekly")
        setActiveSubItem("reports-weekly");
      else if (pathname === "/admin-dashboard/reports/seller-leaderboard")
        setActiveSubItem("reports-seller");
      else if (pathname === "/admin-dashboard/reports/buyer-insights")
        setActiveSubItem("reports-buyer");
      else setActiveSubItem(null);
    } else if (pathname.startsWith("/admin-dashboard/settings")) {
      setActiveMainItem("settings");
      setActiveSubItem(null);
    } else {
      setActiveMainItem(null);
      setActiveSubItem(null);
    }
  }, [pathname]);

  return (
    <aside className="hidden md:flex md:flex-col md:w-[var(--sidebar-width)] bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] sticky top-0 h-screen px-[var(--space-lg)] py-[var(--space-md)]">
      <nav aria-label="Sidebar" className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <Link href="/admin-dashboard">
              <button
                className={`group flex items-center gap-3 w-full px-3 py-3 rounded-lg transition-colors duration-200 ${
                  activeMainItem === "dashboard"
                    ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)] font-[var(--font-weight-semibold)]"
                    : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                }`}
              >
                <LayoutGrid className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                <span>Dashboard</span>
              </button>
            </Link>
          </li>

          <li>
            <button
              onClick={() => setIsLivestreamOpen(!isLivestreamOpen)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg h-12 transition-colors duration-200 ${
                activeMainItem === "livestream"
                  ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                  : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
              }`}
            >
              <Wifi className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              Livestream
              <ChevronDown
                className={`w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] ml-auto transition-transform ${
                  isLivestreamOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isLivestreamOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="space-y-1 mt-1">
                <li>
                  <Link href="/admin-dashboard/livestream/slots">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "slots"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <Calendar className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Slot Management
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin-dashboard/livestream/monitoring">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "monitoring"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <Eye className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Live Monitoring
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin-dashboard/livestream/tiers">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "tiers"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <Trophy className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Tiers and Rules
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <button
              onClick={() => setIsSellersOpen(!isSellersOpen)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg h-12 transition-colors duration-200 ${
                activeMainItem === "sellers"
                  ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                  : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
              }`}
            >
              <Users className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              Sellers
              <ChevronDown
                className={`w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] ml-auto transition-transform ${
                  isSellersOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isSellersOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="space-y-1 mt-1">
                <li>
                  <Link href="/admin-dashboard/sellers/list">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "list"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <Users className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Sellers List
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin-dashboard/sellers/verification">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "verification"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <ShieldCheck className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Sellers Verification
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin-dashboard/sellers/strikes">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "strikes"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <AlertTriangle className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Strikes & Suspensions
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin-dashboard/sellers/appeals">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "appeals"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <FileText className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Appeals & Investigations
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <button
              onClick={() => setIsBuyersOpen(!isBuyersOpen)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg h-12 transition-colors duration-200 ${
                activeMainItem === "buyers"
                  ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                  : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
              }`}
            >
              <Users className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              Buyers
              <ChevronDown
                className={`w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] ml-auto transition-transform ${
                  isBuyersOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isBuyersOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="space-y-1 mt-1">
                <li>
                  <Link href="/admin-dashboard/buyers/list">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "buyers-list"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <Users className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Buyers List
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin-dashboard/buyers/strikes">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "buyers-strikes"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <AlertTriangle className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Strikes & Suspensions
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin-dashboard/buyers/appeals">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "buyers-appeals"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <FileText className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Appeals & Investigations
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <button
              onClick={() => setIsFinanceOpen(!isFinanceOpen)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg h-12 transition-colors duration-200 ${
                activeMainItem === "finance"
                  ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                  : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
              }`}
            >
              <DollarSign className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              Finance
              <ChevronDown
                className={`w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] ml-auto transition-transform ${
                  isFinanceOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isFinanceOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="space-y-1 mt-1">
                <li>
                  <Link href="/admin-dashboard/finance/overview">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "finance-overview"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <OverviewIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Overview
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin-dashboard/finance/payout-management">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "finance-payout"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <CreditCard className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Payout Management
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin-dashboard/finance/fee-configuration">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "finance-fee"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <Wrench className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Fee Configuration
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin-dashboard/finance/revenue-reports">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "finance-revenue"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <TrendingUp className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Revenue Reports
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <button
              onClick={() => setIsReportsOpen(!isReportsOpen)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg h-12 transition-colors duration-200 ${
                activeMainItem === "reports"
                  ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                  : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
              }`}
            >
              <LayoutGrid className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              Reports
              <ChevronDown
                className={`w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] ml-auto transition-transform ${
                  isReportsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isReportsOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="space-y-1 mt-1">
                <li>
                  <Link href="/admin-dashboard/reports/weekly">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "reports-weekly"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <Calendar className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Weekly Reports
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin-dashboard/reports/seller-leaderboard">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "reports-seller"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <Trophy className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Seller Leaderboard
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/admin-dashboard/reports/buyer-insights">
                    <button
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                        activeSubItem === "reports-buyer"
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                      }`}
                    >
                      <TrendingUp className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                      Buyer Insights
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>

      <div className="mt-auto px-2">
        <hr className="border-[var(--sidebar-border)] my-4" />
        <Link href="/admin-dashboard/settings">
          <button
            className={`flex items-center gap-2 text-sm font-normal leading-5 ${
              activeMainItem === "settings"
                ? "text-[var(--sidebar-primary)] font-[var(--font-weight-semibold)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
            Settings
          </button>
        </Link>
        <Link href="/">
          <button className="flex items-center gap-2 text-sm font-normal leading-5 text-destructive mt-3 hover:text-destructive">
            <LogIn className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
            Logout
          </button>
        </Link>
      </div>
    </aside>
  );
}

export { Sidebar };
