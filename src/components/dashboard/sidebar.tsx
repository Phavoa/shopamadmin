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
} from "lucide-react";

function Sidebar() {
  const [isSellersOpen, setIsSellersOpen] = useState(false);
  const [isLivestreamOpen, setIsLivestreamOpen] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const [activeMainItem, setActiveMainItem] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      setActiveMainItem("dashboard");
      setActiveSubItem(null);
    } else if (pathname.startsWith("/livestream")) {
      setActiveMainItem("livestream");
      if (pathname === "/livestream/slots") setActiveSubItem("slots");
      else if (pathname === "/livestream/monitoring")
        setActiveSubItem("monitoring");
      else if (pathname === "/livestream/tiers") setActiveSubItem("tiers");
      else setActiveSubItem(null);
    } else if (pathname.startsWith("/sellers")) {
      setActiveMainItem("sellers");
      if (pathname === "/sellers/list") setActiveSubItem("list");
      else if (pathname === "/sellers/verification")
        setActiveSubItem("verification");
      else if (pathname === "/sellers/strikes") setActiveSubItem("strikes");
      else if (pathname === "/sellers/appeals") setActiveSubItem("appeals");
    } else if (pathname.startsWith("/buyers")) {
      setActiveMainItem("buyers");
      setActiveSubItem(null);
    } else if (pathname.startsWith("/reports")) {
      setActiveMainItem("reports");
      setActiveSubItem(null);
    } else if (pathname.startsWith("/settings")) {
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
                      router.push("/livestream/slots");
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
                      router.push("/livestream/monitoring");
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
                      router.push("/livestream/tiers");
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
                      router.push("/sellers/list");
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
                      router.push("/sellers/verification");
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
                      router.push("/sellers/strikes");
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
                      router.push("/sellers/appeals");
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
            <button className="flex items-center gap-3 w-full text-[var(--foreground)] hover:bg-[var(--sidebar-accent)] px-3 py-3 rounded-lg h-12">
              <Users className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              Buyers
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
