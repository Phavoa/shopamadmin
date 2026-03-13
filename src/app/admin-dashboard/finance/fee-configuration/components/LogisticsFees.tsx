import React from "react";
import { Save, Loader2 } from "lucide-react";
import { ZoneStructureModal } from "./ZoneStructureModal";
import type { DeliveryZone, DeliveryPrice } from "@/api/deliveryApi";

interface LogisticsFeesProps {
  isLoading: boolean;
  isSeeding: boolean;
  isUpdatingPrice: boolean;
  prices: DeliveryPrice[];
  zones: DeliveryZone[];
  localLogisticsFees: Record<string, { price: string; active: boolean }>;
  onSeedLogistics: () => void;
  onUpdateActive: (priceId: string, active: boolean) => void;
  onUpdatePrice: (priceId: string, price: string) => void;
  onBlurPrice: (priceId: string) => void;
}

export const LogisticsFees: React.FC<LogisticsFeesProps> = ({
  isLoading,
  isSeeding,
  isUpdatingPrice,
  prices,
  zones,
  localLogisticsFees,
  onSeedLogistics,
  onUpdateActive,
  onUpdatePrice,
  onBlurPrice,
}) => {
  const [isZoneStructureModalOpen, setIsZoneStructureModalOpen] = React.useState(false);
  const [selectedParentId, setSelectedParentId] = React.useState<string | null>(null);

  const handleOpenStructure = (parentId: string) => {
    setSelectedParentId(parentId);
    setIsZoneStructureModalOpen(true);
  };
  // Helper to get parent info
  const getParentId = (zoneId: string) => zones.find(z => z.id === zoneId)?.parentId;
  const getZoneName = (zoneId: string) => zones.find(z => z.id === zoneId)?.name || zoneId;

  // Group prices
  const groups: Record<string, { name: string; items: any[] }> = {};
  const ungrouped: any[] = [];

  prices.forEach(price => {
    const originParentId = getParentId(price.originZoneId);
    const destParentId = getParentId(price.destinationZoneId);

    // If both are sub-zones of the same parent (Internal)
    if (originParentId && destParentId && originParentId === destParentId) {
      if (!groups[originParentId]) {
        groups[originParentId] = { name: getZoneName(originParentId), items: [] };
      }
      groups[originParentId].items.push(price);
    } 
    // If it's a single zone (Origin == Destination) and it's a parent
    else if (price.originZoneId === price.destinationZoneId && !originParentId) {
      const zoneName = getZoneName(price.originZoneId);
      if (!groups[price.originZoneId]) {
         groups[price.originZoneId] = { name: zoneName, items: [] };
      }
      groups[price.originZoneId].items.push(price);
    }
    else {
      ungrouped.push(price);
    }
  });

  // Sort groups items
  Object.keys(groups).forEach(key => {
    groups[key].items.sort((a, b) => {
      const aOrigin = getZoneName(a.originZoneId);
      const bOrigin = getZoneName(b.originZoneId);
      if (aOrigin !== bOrigin) return aOrigin.localeCompare(bOrigin);
      return getZoneName(a.destinationZoneId).localeCompare(getZoneName(b.destinationZoneId));
    });
  });

  const formatShortName = (name: string) => {
    if (!name) return name;
    // Strip anything after ' — ', ' - ', or '–'
    return name.split(/[—\-\–]/)[0].trim();
  };

  const getParentName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    if (zone?.parentId) {
      return zones.find(p => p.id === zone.parentId)?.name || zone.name;
    }
    return zone?.name || zoneId;
  };

  // Deduplicate ungrouped (Inter-State) by Parent names
  const uniqueUngrouped = new Map<string, any>();
  ungrouped.forEach(price => {
    const oParent = getParentName(price.originZoneId);
    const dParent = getParentName(price.destinationZoneId);
    const key = `${oParent} to ${dParent}`;

    const isRootToRoot = !getParentId(price.originZoneId) && !getParentId(price.destinationZoneId);
    
    // Prefer root-to-root records, or the first one we find
    if (isRootToRoot || !uniqueUngrouped.has(key)) {
      uniqueUngrouped.set(key, price);
    }
  });

  const finalUngrouped = Array.from(uniqueUngrouped.values());

  // Sort final ungrouped by label
  finalUngrouped.sort((a, b) => {
    const aLabel = `${getParentName(a.originZoneId)} to ${getParentName(a.destinationZoneId)}`;
    const bLabel = `${getParentName(b.originZoneId)} to ${getParentName(b.destinationZoneId)}`;
    return aLabel.localeCompare(bLabel);
  });

  const renderPriceRow = (price: any, isInterState = false) => {
    const originZone = zones.find((z) => z.id === price.originZoneId);
    const destZone = zones.find((z) => z.id === price.destinationZoneId);
    const isSameZone = price.originZoneId === price.destinationZoneId;
    
    let label = "";
    if (isSameZone) {
      const name = formatShortName(originZone?.name ?? price.originZoneId);
      if (originZone?.parentId) {
        label = `${name} to ${name}`;
      } else {
        label = name; // Root zones like "Abuja"
      }
    } else if (isInterState) {
      // Clean Parent names for Inter-State
      const originName = formatShortName(getParentName(price.originZoneId));
      const destName = formatShortName(getParentName(price.destinationZoneId));
      label = `${originName} to ${destName}`;
    } else {
      label = `${formatShortName(originZone?.name ?? price.originZoneId)} to ${formatShortName(destZone?.name ?? price.destinationZoneId)}`;
    }

    const feeData = localLogisticsFees[price.id];

    return (
      <div
        key={price.id}
        className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={feeData?.active ?? false}
            onChange={(e) => onUpdateActive(price.id, e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
          />
          <span
            className={`text-[14px] font-medium ${feeData?.active ? "text-[#333]" : "text-gray-400"}`}
          >
            {label}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-semibold text-gray-900 leading-none mt-0.5">₦</span>
            <input
              type="text"
              value={feeData?.price ?? "0"}
              onChange={(e) => onUpdatePrice(price.id, e.target.value)}
              onBlur={() => onBlurPrice(price.id)}
              disabled={!feeData?.active}
              className={`w-20 bg-[#F5F5F5] border-none rounded-lg px-3 py-1.5 text-[13px] font-semibold text-right outline-none transition-opacity focus:ring-1 focus:ring-orange-200 ${feeData?.active ? "opacity-100" : "opacity-50"}`}
            />
          </div>
          {isUpdatingPrice && (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="bg-white border-[0.3px] border-black/20 rounded-[18px] p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">Logistics Fees</h2>
        <button
          onClick={onSeedLogistics}
          disabled={isSeeding}
          className="text-xs font-semibold text-orange-600 px-4 py-2 border border-orange-100 rounded-xl hover:bg-orange-50 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSeeding ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          Initialize Matrix
        </button>
      </div>

      <div className="space-y-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
             <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        ) : prices.length > 0 ? (
          <>
            {/* Render Groups (Parent Zones) sorted by name */}
            {Object.keys(groups)
              .sort((a, b) => groups[a].name.localeCompare(groups[b].name))
              .map((groupId) => (
              <div key={groupId} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[16px] font-bold text-gray-900">
                    {groups[groupId].name}
                  </h3>
                  <button 
                    onClick={() => handleOpenStructure(groupId)}
                    className="flex items-center gap-1.5 text-[14px] font-bold text-gray-900 hover:opacity-70 transition-opacity"
                  >
                    Zone structure
                    <span className="text-[12px] opacity-60">❯</span>
                  </button>
                </div>
                <div className="space-y-0.5 bg-[#FCFCFC]/30 rounded-2xl p-1">
                  {groups[groupId].items.map(price => renderPriceRow(price, false))}
                </div>
              </div>
            ))}

            {/* Render Ungrouped / Inter-State */}
            {ungrouped.length > 0 && (
              <div className="space-y-4">
                <div className="px-2">
                  <h3 className="text-[16px] font-bold text-gray-900">
                    Inter-State / Other Pricing
                  </h3>
                </div>
                <div className="space-y-0.5 bg-[#FCFCFC]/30 rounded-2xl p-1">
                  {finalUngrouped.map(price => renderPriceRow(price, true))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-[15px] text-gray-500 font-medium">
              No delivery price records found. Click &quot;Initialize Matrix&quot;
              to set up zones and pricing.
            </p>
          </div>
        )}
      </div>

      <ZoneStructureModal 
        isOpen={isZoneStructureModalOpen}
        onClose={() => setIsZoneStructureModalOpen(false)}
        zones={zones}
        parentZoneId={selectedParentId}
      />
    </div>
  );
};
