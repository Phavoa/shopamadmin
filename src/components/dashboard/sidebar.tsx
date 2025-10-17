"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

function Sidebar() {
  const [isSellersOpen, setIsSellersOpen] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const router = useRouter();

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
            <button className="flex items-center gap-3 w-full text-[var(--foreground)] hover:bg-[var(--sidebar-accent)] px-3 py-3 rounded-lg h-12">
              <Wifi className="w-[var(--icon-size-sm)] h-[var(--icon-size-sm)]" />
              Livestream
            </button>
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
