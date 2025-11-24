// src/components/logistics/KPIGrid.tsx

import { Card } from "@/components/ui/card";
import { PackageIcon, BusIcon } from "./LogisticsIcons";
import { AlertTriangle } from "lucide-react";

interface KPIData {
  ordersToday: number;
  pickRequests: number;
  atHub: number;
  waitingForDelivery: number;
  exceptions: number;
}

interface KPIGridProps {
  kpis: KPIData;
}

export default function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      <Card className="p-4 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col gap-2 items-center">
          <div className="text-2xl font-bold">{kpis.ordersToday}</div>
          <div className="flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-green-600" />
            <h2 className="text-sm text-gray-600 font-medium">Orders Today</h2>
          </div>
        </div>
      </Card>

      <Card className="p-4 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col gap-2 items-center">
          <div className="text-2xl font-bold">{kpis.pickRequests}</div>
          <div className="flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-green-600" />
            <h2 className="text-sm text-gray-600 font-medium">Pick Requests</h2>
          </div>
        </div>
      </Card>

      <Card className="p-4 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col gap-2 items-center">
          <div className="text-2xl font-bold">{kpis.atHub}</div>
          <div className="flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-green-600" />
            <h2 className="text-sm text-gray-600 font-medium">At Hub</h2>
          </div>
        </div>
      </Card>

      <Card className="p-4 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col gap-2 items-center">
          <div className="text-2xl font-bold">{kpis.waitingForDelivery}</div>
          <div className="flex items-center gap-2">
            <BusIcon className="w-5 h-5 text-orange-600" />
            <h2 className="text-sm text-gray-600 font-medium">
              Out for Delivery
            </h2>
          </div>
        </div>
      </Card>

      <Card className="p-4 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col gap-2 items-center">
          <div className="text-2xl font-bold">{kpis.exceptions}</div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-sm text-gray-600 font-medium">Exceptions</h2>
          </div>
        </div>
      </Card>
    </div>
  );
}
