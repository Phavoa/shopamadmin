"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  CreditCard,
  Wrench,
  TrendingUp,
  Loader2,
  X,
  Store,
} from "lucide-react";
import Link from "next/link";
import { useLogoutMutation } from "@/api/authApi";

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isSellersOpen, setIsSellersOpen] = useState(false);
  const [isLivestreamOpen, setIsLivestreamOpen] = useState(false);
  const [isBuyersOpen, setIsBuyersOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const [activeMainItem, setActiveMainItem] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ✅ Track which nav item is currently loading
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  // ✅ Clear loading state when pathname changes (page loaded)
  useEffect(() => {
    setNavigatingTo(null);
  }, [pathname]);

  const handleLogoutConfirm = async () => {
    try {
      await logout().unwrap();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/auth/login");
    } finally {
      setShowLogoutModal(false);
    }
  };

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);

  // ✅ Nav click handler — sets loading state and prevents double-click
  const handleNavClick = (key: string, href: string) => {
    if (navigatingTo) return; // block if already navigating
    if (pathname === href) return; // already on this page
    setNavigatingTo(key);
    router.push(href);
  };

  const isNavigating = navigatingTo !== null;

  useEffect(() => {
    if (pathname === "/admin-dashboard") {
      setActiveMainItem("dashboard");
      setActiveSubItem(null);
    } else if (pathname.startsWith("/admin-dashboard/livestream")) {
      setActiveMainItem("livestream");
      setIsLivestreamOpen(true);
      if (pathname === "/admin-dashboard/livestream/slots") setActiveSubItem("slots");
      else if (pathname === "/admin-dashboard/livestream/monitoring") setActiveSubItem("monitoring");
      else if (pathname === "/admin-dashboard/livestream/tiers") setActiveSubItem("tiers");
      else setActiveSubItem(null);
    } else if (pathname.startsWith("/admin-dashboard/sellers")) {
      setActiveMainItem("sellers");
      setIsSellersOpen(true);
      if (pathname === "/admin-dashboard/sellers/list") setActiveSubItem("list");
      else if (pathname === "/admin-dashboard/sellers/verification") setActiveSubItem("verification");
      else if (pathname === "/admin-dashboard/sellers/strikes") setActiveSubItem("strikes");
      else if (pathname === "/admin-dashboard/sellers/appeals") setActiveSubItem("appeals");
    } else if (pathname.startsWith("/admin-dashboard/buyers")) {
      setActiveMainItem("buyers");
      setIsBuyersOpen(true);
      if (pathname === "/admin-dashboard/buyers/list") setActiveSubItem("buyers-list");
      else if (pathname === "/admin-dashboard/buyers/strikes") setActiveSubItem("buyers-strikes");
      else if (pathname === "/admin-dashboard/buyers/appeals") setActiveSubItem("buyers-appeals");
      else setActiveSubItem(null);
    } else if (pathname.startsWith("/admin-dashboard/hub-verification")) {
      setActiveMainItem("hub-verification");
      setActiveSubItem(null);
    } else if (pathname.startsWith("/admin-dashboard/finance")) {
      setActiveMainItem("finance");
      setIsFinanceOpen(true);
      if (pathname === "/admin-dashboard/finance/overview") setActiveSubItem("finance-overview");
      else if (pathname === "/admin-dashboard/finance/payout-management") setActiveSubItem("finance-payout");
      else if (pathname === "/admin-dashboard/finance/fee-configuration") setActiveSubItem("finance-fee");
      else if (pathname === "/admin-dashboard/finance/revenue-reports") setActiveSubItem("finance-revenue");
      else setActiveSubItem(null);
    } else if (pathname.startsWith("/admin-dashboard/reports")) {
      setActiveMainItem("reports");
      setIsReportsOpen(true);
      if (pathname === "/admin-dashboard/reports/weekly") setActiveSubItem("reports-weekly");
      else if (pathname === "/admin-dashboard/reports/seller-leaderboard") setActiveSubItem("reports-seller");
      else if (pathname === "/admin-dashboard/reports/buyer-insights") setActiveSubItem("reports-buyer");
      else setActiveSubItem(null);
    } else if (pathname.startsWith("/admin-dashboard/settings")) {
      setActiveMainItem("settings");
      setActiveSubItem(null);
    } else {
      setActiveMainItem(null);
      setActiveSubItem(null);
    }
  }, [pathname]);

  // ── Reusable style helpers ────────────────────────────────────────────────────

  const mainItemClass = (key: string) =>
    `group flex items-center gap-3 w-full px-3 py-3 rounded-lg transition-colors duration-200 cursor-pointer select-none
    ${isNavigating && navigatingTo !== key ? "opacity-40 pointer-events-none" : ""}
    ${activeMainItem === key
      ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)] font-semibold"
      : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
    }`;

  const subItemClass = (key: string) =>
    `flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 cursor-pointer select-none
    ${isNavigating && navigatingTo !== key ? "opacity-40 pointer-events-none" : ""}
    ${activeSubItem === key
      ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
      : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
    }`;

  const spinnerOrIcon = (key: string, icon: React.ReactNode) =>
    navigatingTo === key
      ? <Loader2 className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] animate-spin" />
      : icon;

  return (
    <aside className="hidden md:flex md:flex-col md:w-[var(--sidebar-width)] bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] sticky top-0 h-screen px-[var(--space-lg)] py-[var(--space-md)]">
      <nav aria-label="Sidebar" className="flex-1 overflow-y-auto">
        <ul className="space-y-1">

          {/* Dashboard */}
          <li>
            <button
              onClick={() => handleNavClick("dashboard", "/admin-dashboard")}
              disabled={isNavigating && navigatingTo !== "dashboard"}
              className={mainItemClass("dashboard")}
            >
              {spinnerOrIcon("dashboard", <LayoutGrid className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
              <span>Dashboard</span>
            </button>
          </li>

          {/* Livestream */}
          <li>
            <button
              onClick={() => !isNavigating && setIsLivestreamOpen(!isLivestreamOpen)}
              className={mainItemClass("livestream")}
            >
              <Wifi className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              Livestream
              <ChevronDown className={`w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] ml-auto transition-transform ${isLivestreamOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isLivestreamOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
              <ul className="space-y-1 mt-1">
                <li>
                  <button onClick={() => handleNavClick("slots", "/admin-dashboard/livestream/slots")} disabled={isNavigating && navigatingTo !== "slots"} className={subItemClass("slots")}>
                    {spinnerOrIcon("slots", <Calendar className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Slot Management
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("monitoring", "/admin-dashboard/livestream/monitoring")} disabled={isNavigating && navigatingTo !== "monitoring"} className={subItemClass("monitoring")}>
                    {spinnerOrIcon("monitoring", <Eye className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Live Monitoring
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("tiers", "/admin-dashboard/livestream/tiers")} disabled={isNavigating && navigatingTo !== "tiers"} className={subItemClass("tiers")}>
                    {spinnerOrIcon("tiers", <Trophy className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Tiers and Rules
                  </button>
                </li>
              </ul>
            </div>
          </li>

          {/* Sellers */}
          <li>
            <button
              onClick={() => !isNavigating && setIsSellersOpen(!isSellersOpen)}
              className={mainItemClass("sellers")}
            >
              <Users className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              Sellers
              <ChevronDown className={`w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] ml-auto transition-transform ${isSellersOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSellersOpen ? "max-h-56 opacity-100" : "max-h-0 opacity-0"}`}>
              <ul className="space-y-1 mt-1">
                <li>
                  <button onClick={() => handleNavClick("list", "/admin-dashboard/sellers/list")} disabled={isNavigating && navigatingTo !== "list"} className={subItemClass("list")}>
                    {spinnerOrIcon("list", <Users className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Sellers List
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("verification", "/admin-dashboard/sellers/verification")} disabled={isNavigating && navigatingTo !== "verification"} className={subItemClass("verification")}>
                    {spinnerOrIcon("verification", <ShieldCheck className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Sellers Verification
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("strikes", "/admin-dashboard/sellers/strikes")} disabled={isNavigating && navigatingTo !== "strikes"} className={subItemClass("strikes")}>
                    {spinnerOrIcon("strikes", <AlertTriangle className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Strikes & Suspensions
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("appeals", "/admin-dashboard/sellers/appeals")} disabled={isNavigating && navigatingTo !== "appeals"} className={subItemClass("appeals")}>
                    {spinnerOrIcon("appeals", <FileText className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Appeals & Investigations
                  </button>
                </li>
              </ul>
            </div>
          </li>

          {/* Buyers */}
          <li>
            <button
              onClick={() => !isNavigating && setIsBuyersOpen(!isBuyersOpen)}
              className={mainItemClass("buyers")}
            >
              <Users className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              Buyers
              <ChevronDown className={`w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] ml-auto transition-transform ${isBuyersOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isBuyersOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
              <ul className="space-y-1 mt-1">
                <li>
                  <button onClick={() => handleNavClick("buyers-list", "/admin-dashboard/buyers/list")} disabled={isNavigating && navigatingTo !== "buyers-list"} className={subItemClass("buyers-list")}>
                    {spinnerOrIcon("buyers-list", <Users className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Buyers List
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("buyers-strikes", "/admin-dashboard/buyers/strikes")} disabled={isNavigating && navigatingTo !== "buyers-strikes"} className={subItemClass("buyers-strikes")}>
                    {spinnerOrIcon("buyers-strikes", <AlertTriangle className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Strikes & Suspensions
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("buyers-appeals", "/admin-dashboard/buyers/appeals")} disabled={isNavigating && navigatingTo !== "buyers-appeals"} className={subItemClass("buyers-appeals")}>
                    {spinnerOrIcon("buyers-appeals", <FileText className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Appeals & Investigations
                  </button>
                </li>
              </ul>
            </div>
          </li>

          {/* Finance */}
          <li>
            <Link href="/admin-dashboard/hub-verification">
              <button
                className={`group flex items-center gap-3 w-full px-3 py-3 rounded-lg transition-colors duration-200 ${
                  activeMainItem === "hub-verification"
                    ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)] font-[var(--font-weight-semibold)]"
                    : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                }`}
              >
                <Store className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                <span>Hub Verification</span>
              </button>
            </Link>
          </li>

          <li>
            <button
              onClick={() => !isNavigating && setIsFinanceOpen(!isFinanceOpen)}
              className={mainItemClass("finance")}
            >
              <DollarSign className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              Finance
              <ChevronDown className={`w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] ml-auto transition-transform ${isFinanceOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isFinanceOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
              <ul className="space-y-1 mt-1">
                <li>
                  <button onClick={() => handleNavClick("finance-overview", "/admin-dashboard/finance/overview")} disabled={isNavigating && navigatingTo !== "finance-overview"} className={subItemClass("finance-overview")}>
                    {spinnerOrIcon("finance-overview", <LayoutGrid className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Overview
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("finance-payout", "/admin-dashboard/finance/payout-management")} disabled={isNavigating && navigatingTo !== "finance-payout"} className={subItemClass("finance-payout")}>
                    {spinnerOrIcon("finance-payout", <CreditCard className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Payout Management
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("finance-fee", "/admin-dashboard/finance/fee-configuration")} disabled={isNavigating && navigatingTo !== "finance-fee"} className={subItemClass("finance-fee")}>
                    {spinnerOrIcon("finance-fee", <Wrench className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Fee Configuration
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("finance-revenue", "/admin-dashboard/finance/revenue-reports")} disabled={isNavigating && navigatingTo !== "finance-revenue"} className={subItemClass("finance-revenue")}>
                    {spinnerOrIcon("finance-revenue", <TrendingUp className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Revenue Reports
                  </button>
                </li>
              </ul>
            </div>
          </li>

          {/* Reports */}
          <li>
            <button
              onClick={() => !isNavigating && setIsReportsOpen(!isReportsOpen)}
              className={mainItemClass("reports")}
            >
              <LayoutGrid className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              Reports
              <ChevronDown className={`w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] ml-auto transition-transform ${isReportsOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isReportsOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
              <ul className="space-y-1 mt-1">
                <li>
                  <button onClick={() => handleNavClick("reports-weekly", "/admin-dashboard/reports/weekly")} disabled={isNavigating && navigatingTo !== "reports-weekly"} className={subItemClass("reports-weekly")}>
                    {spinnerOrIcon("reports-weekly", <Calendar className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Weekly Reports
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("reports-seller", "/admin-dashboard/reports/seller-leaderboard")} disabled={isNavigating && navigatingTo !== "reports-seller"} className={subItemClass("reports-seller")}>
                    {spinnerOrIcon("reports-seller", <Trophy className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Seller Leaderboard
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("reports-buyer", "/admin-dashboard/reports/buyer-insights")} disabled={isNavigating && navigatingTo !== "reports-buyer"} className={subItemClass("reports-buyer")}>
                    {spinnerOrIcon("reports-buyer", <TrendingUp className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
                    Buyer Insights
                  </button>
                </li>
              </ul>
            </div>
          </li>

        </ul>
      </nav>

      {/* Bottom — Settings + Logout */}
      <div className="mt-auto px-2">
        <hr className="border-[var(--sidebar-border)] my-4" />
        <button
          onClick={() => handleNavClick("settings", "/admin-dashboard/settings")}
          disabled={isNavigating && navigatingTo !== "settings"}
          className={`flex items-center gap-2 text-sm font-normal leading-5 cursor-pointer
            ${isNavigating && navigatingTo !== "settings" ? "opacity-40 pointer-events-none" : ""}
            ${activeMainItem === "settings" ? "text-[var(--sidebar-primary)] font-semibold" : "text-muted-foreground hover:text-foreground"}`}
        >
          {spinnerOrIcon("settings", <Settings className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />)}
          Settings
        </button>
        <button
          onClick={handleLogoutClick}
          disabled={isLoggingOut || isNavigating}
          className="flex items-center gap-2 text-sm font-normal leading-5 text-destructive mt-3 hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoggingOut
            ? <Loader2 className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] animate-spin" />
            : <LogIn className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />}
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[3px] flex items-center justify-center z-50"
          onClick={handleCloseLogoutModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
              <button onClick={handleCloseLogoutModal} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to log out? You will need to sign in again to access your account.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={handleCloseLogoutModal} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {isLoggingOut && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoggingOut ? "Logging out..." : "Log out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export { Sidebar };