import React from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { CommissionTier } from "@/api/feeConfigApi";

interface CommissionTiersProps {
  tiers: CommissionTier[];
  isLoading: boolean;
  isCreating: boolean;
  onAddTier: () => void;
  onUpdateTierState: (id: string, updates: Partial<CommissionTier>) => void;
  onUpdateTierApi: (id: string) => void;
  onDeleteTier: (id: string) => void;
}

export const CommissionTiers: React.FC<CommissionTiersProps> = ({
  tiers,
  isLoading,
  isCreating,
  onAddTier,
  onUpdateTierState,
  onUpdateTierApi,
  onDeleteTier,
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-black">
          Shopping Commission (All Goods)
        </h2>
        <button
          onClick={onAddTier}
          disabled={isCreating}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[var(--sidebar-primary)] border border-[var(--sidebar-primary)] rounded-lg hover:bg-orange-50 transition-colors"
        >
          {isCreating ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
          Add Tier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-50 animate-pulse rounded-xl"
              />
            ))
        ) : tiers.length > 0 ? (
          tiers.map((tier) => (
            <div
              key={tier.id}
              className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 group relative"
            >
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={tier.name}
                  onChange={(e) =>
                    onUpdateTierState(tier.id, {
                      name: e.target.value,
                    })
                  }
                  onBlur={() => onUpdateTierApi(tier.id)}
                  className="text-sm font-medium text-black bg-transparent border-none outline-none focus:ring-1 focus:ring-orange-200 rounded px-1 w-2/3"
                />
                <button
                  onClick={() => onDeleteTier(tier.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Tier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Min amount (₦):
                  </label>
                  <input
                    type="text"
                    value={tier.minAmount ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d*$/.test(val)) {
                        onUpdateTierState(tier.id, {
                          minAmount: val,
                        });
                      }
                    }}
                    onBlur={() => onUpdateTierApi(tier.id)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Max amount (₦):
                  </label>
                  <input
                    type="text"
                    value={tier.maxAmount ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d*$/.test(val)) {
                        onUpdateTierState(tier.id, {
                          maxAmount: val,
                        });
                      }
                    }}
                    onBlur={() => onUpdateTierApi(tier.id)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Commission %:
                  </label>
                  <input
                    type="text"
                    value={tier.percentage ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d*$/.test(val)) {
                        onUpdateTierState(tier.id, {
                          percentage: val as any,
                        });
                      }
                    }}
                    onBlur={() => onUpdateTierApi(tier.id)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-500 transition-colors font-semibold text-orange-600"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No commission tiers defined. Click "Add Tier" to create one.
          </div>
        )}
      </div>
    </div>
  );
};
