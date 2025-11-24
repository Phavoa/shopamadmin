// src/components/logistics/RiderStatus.tsx

import { Card } from "@/components/ui/card";
import { TruckIcon } from "./LogisticsIcons";

interface Rider {
  name: string;
  status: string;
  color: string;
}

interface RiderStatusProps {
  riders: Rider[];
}

export default function RiderStatus({ riders }: RiderStatusProps) {
  return (
    <Card className="mb-6">
      <div className="p-4 border-b flex items-center gap-2">
        <TruckIcon className="w-5 h-5 text-orange-600" />
        <h2 className="font-semibold text-lg">Rider Status</h2>
      </div>
      <div className="p-5 flex gap-45">
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
          {riders[0]?.name || "Rider Paul"} - {riders[0]?.status || "Available"}
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
          {riders[1]?.name || "Rider Obi"} -{" "}
          {riders[1]?.status || "On Delivery"}
        </button>
        <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-medium transition-colors">
          {riders[2]?.name || "Rider Seyi"} -{" "}
          {riders[2]?.status || "Picking Up"}
        </button>
        <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
          {riders[3]?.name || "Rider Ahmed"} - {riders[3]?.status || "Offline"}
        </button>
      </div>
    </Card>
  );
}
