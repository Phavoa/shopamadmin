import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const alerts = [
  {
    id: "a1",
    type: "Finance",
    text: "Failed payout - Phone City ₦85,000",
    action: "Retry",
  },
  {
    id: "a2",
    type: "Disputes",
    text: "New case SH-8010 opened (No delivery)",
    action: "Assign",
  },
  {
    id: "a3",
    type: "Livestream",
    text: "High latency detected on stream SLS-392",
    action: "Open Console",
  },
  {
    id: "a4",
    type: "Security",
    text: "2FA disabled for 1 admin - enable now",
    action: "Fix",
  },
];

function AlertsCard() {
  return (
    <Card className="rounded-[var(--radius-md)] border border-[var(--border)] shadow-[var(--elev-2)] bg-[var(--card)]">
      <div className="p-[var(--space-lg)]">
        <h2 className="text-[var(--text-h2-size)] font-[var(--text-h2-weight)] leading-[var(--text-h2-line)] text-[var(--foreground)]">
          Alerts & Notifications
        </h2>
        <ul className="mt-4 divide-y divide-[var(--border)]">
          {alerts.map((a) => (
            <li key={a.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="text-[var(--text-body-size)] font-[var(--font-weight-medium)] leading-[var(--text-body-line)] text-[var(--foreground)]">
                  <span className="text-[var(--success)] mr-2">{a.type}:</span>
                  {a.text}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 px-3 rounded-[var(--radius-sm)] bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80"
                  onClick={() => alert(`${a.action} clicked`)}
                >
                  {a.action}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export { AlertsCard };
