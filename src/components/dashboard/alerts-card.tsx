import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useResolveSystemAlertMutation,
} from "@/api/systemAlertsApi";
import type { AlertDomain } from "@/api/systemAlertsApi";
import {
  DollarSign,
  FileText,
  ShieldAlert,
  Server,
  CheckCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";

import { SystemAlert } from "@/api/adminApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const domainLabel: Record<AlertDomain, string> = {
  FINANCE: "Finance",
  DISPUTES: "Disputes",
  SECURITY: "Security",
  SYSTEM: "System",
};

const domainColor: Record<AlertDomain, string> = {
  FINANCE: "text-blue-600",
  DISPUTES: "text-amber-600",
  SECURITY: "text-red-600",
  SYSTEM: "text-purple-600",
};

const domainIcon = (domain: AlertDomain) => {
  const cls = "w-3.5 h-3.5 inline-block mr-1";
  switch (domain) {
    case "FINANCE":
      return <DollarSign className={cls} />;
    case "DISPUTES":
      return <FileText className={cls} />;
    case "SECURITY":
      return <ShieldAlert className={cls} />;
    case "SYSTEM":
      return <Server className={cls} />;
  }
};

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function AlertRowSkeleton() {
  return (
    <li className="py-3 flex items-center justify-between animate-pulse">
      <div className="space-y-1.5 flex-1 mr-4">
        <div className="h-3 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
      <div className="h-8 w-20 bg-gray-200 rounded-md flex-shrink-0" />
    </li>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AlertsCardProps {
  alerts?: SystemAlert[];
  isLoading?: boolean;
}

function AlertsCard({ alerts: propsAlerts, isLoading: propsLoading }: AlertsCardProps) {
  const [resolveAlert, { isLoading: isResolving }] =
    useResolveSystemAlertMutation();

  const [resolvingId, setResolvingId] = React.useState<string | null>(null);

  // Use props if provided, otherwise empty array
  const alerts = propsAlerts ?? [];
  const isLoading = propsLoading ?? false;
  const isError = false; // We don't have isError from props yet, but we can assume success if alerts are passed

  const handleResolve = async (id: string) => {
    setResolvingId(id);
    try {
      await resolveAlert(id).unwrap();
    } catch {
      // silent — cache update still happens via invalidation
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <Card className="rounded-[var(--radius-md)] border border-[var(--border)] shadow-[var(--elev-2)] bg-[var(--card)]">
      <div className="p-[var(--space-lg)]">
        <h2 className="text-[var(--text-h2-size)] font-[var(--text-h2-weight)] leading-[var(--text-h2-line)] text-[var(--foreground)]">
          Alerts &amp; Notifications
        </h2>

        <ul className="mt-4 divide-y divide-[var(--border)]">
          {isLoading ? (
            <>
              <AlertRowSkeleton />
              <AlertRowSkeleton />
              <AlertRowSkeleton />
            </>
          ) : isError ? (
            <li className="py-6 text-sm text-gray-400 text-center flex flex-col items-center gap-1">
              <span className="text-2xl">🔔</span>
              <span>System alerts are not yet available.</span>
              <span className="text-xs text-gray-300">
                Contact your backend team to activate this feature.
              </span>
            </li>
          ) : alerts.length === 0 ? (
            <li className="py-4 text-sm text-gray-400 text-center">
              ✅ No active alerts right now.
            </li>
          ) : (
            alerts.map((a) => (
              <li
                key={a.id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-semibold mb-0.5 flex items-center ${domainColor[a.domain]}`}
                  >
                    {domainIcon(a.domain)}
                    {domainLabel[a.domain]}
                  </div>
                  <p className="text-[var(--text-body-size)] font-[var(--font-weight-medium)] leading-[var(--text-body-line)] text-[var(--foreground)] truncate">
                    {a.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {a.actionLink && (
                    <a
                      href={a.actionLink}
                      className="flex items-center gap-1 text-xs text-[#E67E22] hover:underline"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 px-3 rounded-[var(--radius-sm)] bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80 disabled:opacity-50"
                    onClick={() => handleResolve(a.id)}
                    disabled={resolvingId === a.id || isResolving}
                  >
                    {resolvingId === a.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    )}
                    Resolve
                  </Button>
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
