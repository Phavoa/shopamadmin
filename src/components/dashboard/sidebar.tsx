"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Wifi,
  Users,
  BarChart2,
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
} from "lucide-react";

function Sidebar() {
  const [isSellersOpen, setIsSellersOpen] = useState(false);
  const [isLivestreamOpen, setIsLivestreamOpen] = useState(false);
  const [isBuyersOpen, setIsBuyersOpen] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const [activeMainItem, setActiveMainItem] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin-dashboard") {
      setActiveMainItem("dashboard");
      setActiveSubItem(null);
    } else if (pathname.startsWith("/admin-dashboard/livestream")) {
      setActiveMainItem("livestream");
      if (pathname === "/admin-dashboard/livestream/slots")
        setActiveSubItem("slots");
      else if (pathname === "/admin-dashboard/livestream/monitoring")
        setActiveSubItem("monitoring");
      else if (pathname === "/admin-dashboard/livestream/tiers")
        setActiveSubItem("tiers");
      else setActiveSubItem(null);
    } else if (pathname.startsWith("/admin-dashboard/sellers")) {
      setActiveMainItem("sellers");
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
      if (pathname === "/admin-dashboard/buyers/list")
        setActiveSubItem("buyers-list");
      else if (pathname === "/admin-dashboard/buyers/strikes")
        setActiveSubItem("buyers-strikes");
      else if (pathname === "/admin-dashboard/buyers/appeals")
        setActiveSubItem("buyers-appeals");
      else setActiveSubItem(null);
    } else if (pathname.startsWith("/admin-dashboard/reports")) {
      setActiveMainItem("reports");
      setActiveSubItem(null);
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
      <nav aria-label="Sidebar" className="flex-1">
        <ul className="space-y-1">
          <li>
            <a
              href="#"
              className="group flex items-center gap-3 px-3 py-3 rounded-lg bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)] font-[var(--font-weight-semibold)] "
            >
              <LayoutGrid />
              <span>Dashboard</span>
            </a>
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
              <ul className=" space-y-1 mt-1">
                <li>
                  <button
                    onClick={() => {
                      setActiveSubItem("slots");
                      router.push("/admin-dashboard/livestream/slots");
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                      activeSubItem === "slots"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <Calendar className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    Slot Management
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveSubItem("monitoring");
                      router.push("/admin-dashboard/livestream/monitoring");
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                      activeSubItem === "monitoring"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <Eye className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    Live Monitoring
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveSubItem("tiers");
                      router.push("/admin-dashboard/livestream/tiers");
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                      activeSubItem === "tiers"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <Trophy className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    Tiers and Rules
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <button
              onClick={() => setIsSellersOpen(!isSellersOpen)}
              className="flex items-center gap-3 w-full text-[var(--foreground)] hover:bg-[var(--sidebar-accent)] px-3 py-3 rounded-lg h-12"
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
              <ul className=" space-y-1 mt-1">
                <li>
                  <button
                    onClick={() => {
                      setActiveSubItem("list");
                      router.push("/admin-dashboard/sellers/list");
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                      activeSubItem === "list"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <Users className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    Sellers List
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveSubItem("verification");
                      router.push("/admin-dashboard/sellers/verification");
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                      activeSubItem === "verification"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <ShieldCheck className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    Sellers Verification
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveSubItem("strikes");
                      router.push("/admin-dashboard/sellers/strikes");
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                      activeSubItem === "strikes"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <AlertTriangle className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    Strikes & Suspensions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveSubItem("appeals");
                      router.push("/admin-dashboard/sellers/appeals");
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                      activeSubItem === "appeals"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <FileText className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    Appeals & Investigations
                  </button>
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
              <ul className=" space-y-1 mt-1">
                <li>
                  <button
                    onClick={() => {
                      setActiveSubItem("buyers-list");
                      router.push("/admin-dashboard/buyers/list");
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                      activeSubItem === "buyers-list"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <Users className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    Buyers List
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveSubItem("buyers-strikes");
                      router.push("/admin-dashboard/buyers/strikes");
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                      activeSubItem === "buyers-strikes"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <AlertTriangle className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    Strikes & Suspensions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveSubItem("buyers-appeals");
                      router.push("/admin-dashboard/buyers/appeals");
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg h-10 text-sm transition-colors duration-200 ${
                      activeSubItem === "buyers-appeals"
                        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                        : "text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    }`}
                  >
                    <FileText className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
                    Appeals & Investigations
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <button className="flex items-center gap-3 w-full text-[var(--foreground)] hover:bg-[var(--sidebar-accent)] px-3 py-3 rounded-lg h-12">
              <DollarSign className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              Finance
            </button>
          </li>

          <li>
            <button className="flex items-center gap-3 w-full text-[var(--foreground)] hover:bg-[var(--sidebar-accent)] px-3 py-3 rounded-lg h-12">
              <BarChart2 className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              Reports
            </button>
          </li>
        </ul>
      </nav>

      <div className="mt-auto px-2">
        <hr className="border-[var(--sidebar-border)] my-4" />
        <button className="flex items-center gap-2 text-[var(--text-body-size)] font-[var(--text-body-weight)] leading-[var(--text-body-line)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          <Settings className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
          Settings
        </button>
        <button className="flex items-center gap-2 text-[var(--text-body-size)] font-[var(--text-body-weight)] leading-[var(--text-body-line)] text-[var(--destructive)] mt-3 hover:text-[var(--destructive)]">
          <LogIn className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export { Sidebar };
