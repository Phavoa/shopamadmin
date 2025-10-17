import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const logistics = [
  { label: "Awaiting Pickup", items: 48, action: "View" },
  { label: "In Hub (Processing)", items: 112, action: "View" },
  { label: "Out for Delivery", items: 74, action: "Track" },
  { label: "Exceptions", items: 3, action: "Investigate" },
];

function LogisticsCard() {
  return (
    <div className="h-full rounded-[var(--radius-md)] border border-[var(--border)]  bg-[var(--card)]">
      <div className="p-[var(--space-lg)]">
        <h2 className="text-2xl font-semibold leading-[var(--text-h2-line)] text-black">
          Logistics Snapshot (Today)
        </h2>
        <ul className="mt-2 divide-y divide-[var(--border)]">
          {logistics.map((l) => (
            <li
              key={l.label}
              className="py-10 flex items-center justify-between h-16"
            >
              <div>
                <div className="text-base font-medium text-black leading-[var(--text-body-lg-line)]">
                  {l.label}
                </div>
                <div className="text-sm text-gray-600 leading-[var(--text-caption-line)] ]">
                  {l.items} Items
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                onClick={() => alert(`${l.action} — ${l.label}`)}
              >
                {l.action}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { LogisticsCard };
