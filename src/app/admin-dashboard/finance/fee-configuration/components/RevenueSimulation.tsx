import React from "react";
import { formatNaira, koboToNaira } from "@/lib/utils";

interface RevenueSimulationProps {
  expectedPerMonth: string;
  isSimulating: boolean;
  simulationData: any;
  setExpectedPerMonth: (val: string) => void;
  onSimulate: () => void;
}

export const RevenueSimulation: React.FC<RevenueSimulationProps> = ({
  expectedPerMonth,
  isSimulating,
  simulationData,
  setExpectedPerMonth,
  onSimulate,
}) => {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "18px",
        border: "0.3px solid rgba(0, 0, 0, 0.20)",
        background: "#FFF",
      }}
    >
      <h2 className="text-base font-semibold text-black mb-6">
        Simulation (What-if)
      </h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">
            Input: Expected per month:
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs">₦</span>
            <input
              type="text"
              value={expectedPerMonth}
              onChange={(e) => setExpectedPerMonth(e.target.value)}
              onBlur={onSimulate}
              style={{
                width: "120px",
                padding: "4px 8px",
                borderRadius: "4px",
                border: "0.3px solid rgba(0, 0, 0, 0.20)",
                fontSize: "12px",
                textAlign: "right",
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">
            Projected platform revenue:
          </span>
          <span className="text-sm font-semibold text-black">
            {isSimulating
              ? "..."
              : formatNaira(
                  koboToNaira(simulationData?.projectedPlatformRevenueKobo),
                )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Shopping GMV portion:</span>
          <span className="text-sm font-semibold text-black">
            {isSimulating
              ? "..."
              : formatNaira(
                  koboToNaira(simulationData?.shoppingGmvPortionKobo),
                )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">
            Projected payout fees collected:
          </span>
          <span className="text-sm font-semibold text-black">
            {isSimulating
              ? "..."
              : formatNaira(
                  koboToNaira(simulationData?.projectedPayoutFeesKobo),
                )}
          </span>
        </div>
      </div>
    </div>
  );
};
