import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { SystemAlert } from "@/api/adminApi";
import Link from "next/link";

interface AlertsCardProps {
  alerts?: SystemAlert[];
  isLoading?: boolean;
}

function AlertsCard({ alerts, isLoading }: AlertsCardProps) {
  return (
    <Card className="rounded-[var(--radius-md)] border border-[var(--border)] shadow-[var(--elev-2)] bg-[var(--card)]">
      <div className="p-[var(--space-lg)]">
        <h2 className="text-[var(--text-h2-size)] font-[var(--text-h2-weight)] leading-[var(--text-h2-line)]">
          Alerts & Notifications
        </h2>
        <ul className="mt-4 divide-y divide-[var(--border)] min-h-[100px]">
          {isLoading ? (
            <li className="py-8 text-center text-[var(--text-muted)]">
              Loading alerts...
            </li>
          ) : !alerts || alerts.length === 0 ? (
            <li className="py-8 text-center text-[var(--text-muted)]">
              No active alerts.
            </li>
          ) : (
            alerts.map((a) => (
              <li key={a.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-[var(--text-body-size)] font-[var(--font-weight-medium)] leading-[var(--text-body-line)]">
                    <span className="text-[var(--success)] mr-2">
                      {a.domain}:
                    </span>
                    {a.message}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={a.actionLink || "#"}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 px-3 rounded-[var(--radius-sm)] bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80"
                    >
                      View
                    </Button>
                  </Link>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </Card>
  );
}

export { AlertsCard };
