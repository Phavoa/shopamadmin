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
  LayoutGrid as OverviewIcon,
  CreditCard,
  Wrench,
  TrendingUp,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useLogoutMutation } from "@/api/authApi";

function Sidebar() {
  const router = useRouter();
  const [isSellersOpen, setIsSellersOpen] = useState(false);
  const [isLivestreamOpen, setIsLivestreamOpen] = useState(false);
  const [isBuyersOpen, setIsBuyersOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const [activeMainItem, setActiveMainItem] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loadingItem, setLoadingItem] = useState<string | null>(null);
  const pathname = usePathname();

  // Auth logout mutation
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  // Handle navigation with loading state
  const handleNavigation = (path: string, itemId: string) => {
    setLoadingItem(itemId);
    router.push(path);
  };

  // Clear loading state when pathname changes
  useEffect(() => {
    setLoadingItem(null);
  }, [pathname]);

  // Handle logout confirmation
  const handleLogoutConfirm = async () => {
    try {
      await logout().unwrap();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, redirect to login page
      router.push("/auth/login");
    } finally {
      setShowLogoutModal(false);
    }
  };

  // Show logout confirmation modal
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Close logout confirmation modal
  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false);
  };

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
            <button
              onClick={() => handleNavigation("/admin-dashboard", "dashboard")}
              disabled={loadingItem !== null}
              className={`group flex cursor-pointer items-center gap-3 w-full px-3 py-3 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                activeMainItem === "dashboard"
                  ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)] font-[var(--font-weight-semibold)]"
                  : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
              }`}
            >
              <LayoutGrid className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              <span>Dashboard</span>
              {loadingItem === "dashboard" && (
                <Loader2 className="w-4 h-4 animate-spin ml-auto" />
              )}
            </button>
          </li>

          <li>
            <button
              onClick={() => setIsLivestreamOpen(!isLivestreamOpen)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg h-12 transition-colors duration-200 cursor-pointer ${
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
                  <button
                    onClick={() =>
                      handleNavigation("/admin-dashboard/livestream/slots", "slots")
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "slots"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <Calendar className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Slot Management</span>
                    {loadingItem === "slots" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleNavigation(
                        "/admin-dashboard/livestream/monitoring",
                        "monitoring"
                      )
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "monitoring"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <Eye className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Live Monitoring</span>
                    {loadingItem === "monitoring" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleNavigation("/admin-dashboard/livestream/tiers", "tiers")
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "tiers"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <Trophy className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Tiers and Rules</span>
                    {loadingItem === "tiers" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <button
              onClick={() => setIsSellersOpen(!isSellersOpen)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg h-12 transition-colors duration-200 cursor-pointer ${
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
                  <button
                    onClick={() =>
                      handleNavigation("/admin-dashboard/sellers/list", "list")
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "list"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <Users className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Sellers List</span>
                    {loadingItem === "list" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleNavigation(
                        "/admin-dashboard/sellers/verification",
                        "verification"
                      )
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "verification"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <ShieldCheck className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Sellers Verification</span>
                    {loadingItem === "verification" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleNavigation("/admin-dashboard/sellers/strikes", "strikes")
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "strikes"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <AlertTriangle className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Strikes & Suspensions</span>
                    {loadingItem === "strikes" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleNavigation("/admin-dashboard/sellers/appeals", "appeals")
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "appeals"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <FileText className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Appeals & Investigations</span>
                    {loadingItem === "appeals" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <button
              onClick={() => setIsBuyersOpen(!isBuyersOpen)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg h-12 cursor-pointer transition-colors duration-200 ${
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
                  <button
                    onClick={() =>
                      handleNavigation("/admin-dashboard/buyers/list", "buyers-list")
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm cursor-pointer transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "buyers-list"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <Users className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Buyers List</span>
                    {loadingItem === "buyers-list" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleNavigation(
                        "/admin-dashboard/buyers/strikes",
                        "buyers-strikes"
                      )
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm cursor-pointer transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "buyers-strikes"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <AlertTriangle className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Strikes & Suspensions</span>
                    {loadingItem === "buyers-strikes" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleNavigation(
                        "/admin-dashboard/buyers/appeals",
                        "buyers-appeals"
                      )
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm cursor-pointer transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "buyers-appeals"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <FileText className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Appeals & Investigations</span>
                    {loadingItem === "buyers-appeals" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <button
              onClick={() => setIsFinanceOpen(!isFinanceOpen)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg h-12 cursor-pointer transition-colors duration-200 ${
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
                  <button
                    onClick={() =>
                      handleNavigation(
                        "/admin-dashboard/finance/overview",
                        "finance-overview"
                      )
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm cursor-pointer transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "finance-overview"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <OverviewIcon className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Overview</span>
                    {loadingItem === "finance-overview" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleNavigation(
                        "/admin-dashboard/finance/payout-management",
                        "finance-payout"
                      )
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm cursor-pointer transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "finance-payout"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <CreditCard className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Payout Management</span>
                    {loadingItem === "finance-payout" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleNavigation(
                        "/admin-dashboard/finance/fee-configuration",
                        "finance-fee"
                      )
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm cursor-pointer transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "finance-fee"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <Wrench className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Fee Configuration</span>
                    {loadingItem === "finance-fee" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleNavigation(
                        "/admin-dashboard/finance/revenue-reports",
                        "finance-revenue"
                      )
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm cursor-pointer transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "finance-revenue"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <TrendingUp className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Revenue Reports</span>
                    {loadingItem === "finance-revenue" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <button
              onClick={() => setIsReportsOpen(!isReportsOpen)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg h-12 cursor-pointer transition-colors duration-200 ${
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
                  <button
                    onClick={() =>
                      handleNavigation(
                        "/admin-dashboard/reports/weekly",
                        "reports-weekly"
                      )
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm cursor-pointer transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "reports-weekly"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <Calendar className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Weekly Reports</span>
                    {loadingItem === "reports-weekly" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleNavigation(
                        "/admin-dashboard/reports/seller-leaderboard",
                        "reports-seller"
                      )
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm cursor-pointer transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "reports-seller"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <Trophy className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Seller Leaderboard</span>
                    {loadingItem === "reports-seller" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleNavigation(
                        "/admin-dashboard/reports/buyer-insights",
                        "reports-buyer"
                      )
                    }
                    disabled={loadingItem !== null}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm cursor-pointer transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeSubItem === "reports-buyer"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <TrendingUp className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    <span>Buyer Insights</span>
                    {loadingItem === "reports-buyer" && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>

      <div className="mt-auto px-2">
        <hr className="border-[var(--sidebar-border)] my-4" />
        <button
          onClick={() => handleNavigation("/admin-dashboard/settings", "settings")}
          disabled={loadingItem !== null}
          className={`flex items-center gap-2 text-sm font-normal leading-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            activeMainItem === "settings"
              ? "text-[var(--sidebar-primary)] font-[var(--font-weight-semibold)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
          <span>Settings</span>
          {loadingItem === "settings" && (
            <Loader2 className="w-4 h-4 animate-spin ml-auto" />
          )}
        </button>
        <button
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="flex items-center gap-2 text-sm font-normal leading-5 text-destructive cursor-pointer mt-3 hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <Loader2 className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)] animate-spin" />
          ) : (
            <LogIn className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
          )}
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
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Logout
              </h3>
              <button
                onClick={handleCloseLogoutModal}
                className="p-1 hover:bg-gray-100 rounded cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to log out? You will need to sign in again
                to access your account.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseLogoutModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
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