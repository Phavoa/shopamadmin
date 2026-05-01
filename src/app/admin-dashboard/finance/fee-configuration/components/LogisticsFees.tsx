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

  // Group prices — we still need this for inter-state/other
  const ungrouped: any[] = [];
  
  prices.forEach(price => {
    const originParentId = getParentId(price.originZoneId);
    const destParentId = getParentId(price.destinationZoneId);

    // If it's NOT internal to a parent, it goes to ungrouped
    if (!(originParentId && destParentId && originParentId === destParentId)) {
      // Also check if it's a parent-to-parent record
      if (!(price.originZoneId === price.destinationZoneId && !originParentId)) {
          ungrouped.push(price);
      }
    }
  });

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
    
    if (isRootToRoot || !uniqueUngrouped.has(key)) {
      uniqueUngrouped.set(key, price);
    }
  });

  const finalUngrouped = Array.from(uniqueUngrouped.values());
  finalUngrouped.sort((a, b) => {
    const aLabel = `${getParentName(a.originZoneId)} to ${getParentName(a.destinationZoneId)}`;
    const bLabel = `${getParentName(b.originZoneId)} to ${getParentName(b.destinationZoneId)}`;
    return aLabel.localeCompare(bLabel);
  });

  // Check if any zone combinations are missing prices
  const hasMissingPrices = zones.some(origin => {
    const originParent = getParentId(origin.id);
    if (!originParent) return false;
    const destsInSameParent = zones.filter(z => z.parentId === originParent);
    return destsInSameParent.some(dest => 
       !prices.find(p => p.originZoneId === origin.id && p.destinationZoneId === dest.id)
    );
  });

  const formatShortName = (name: string) => {
    if (!name) return name;
    // Strip anything after ' — ', ' - ', or '–'
    return name.split(/[—\-\–]/)[0].trim();
  };

  const renderPriceRow = (
    price: any, 
    isInterState = false, 
    tempPair?: { originId: string; destId: string },
    mergedIds?: string[]
  ) => {
    const originZone = zones.find((z) => z.id === (price?.originZoneId || tempPair?.originId));
    const destZone = zones.find((z) => z.id === (price?.destinationZoneId || tempPair?.destId));
    const isSameZone = (price?.originZoneId || tempPair?.originId) === (price?.destinationZoneId || tempPair?.destId);
    
    let label = "";
    if (isSameZone) {
      label = formatShortName(originZone?.name || (price?.originZoneId || tempPair?.originId));
    } else if (isInterState) {
      const originName = formatShortName(getParentName(price.originZoneId));
      const destName = formatShortName(getParentName(price.destinationZoneId));
      // Sort parent names alphabetically for Inter-State as well
      const sortedNames = [originName, destName].sort();
      label = sortedNames[0] === sortedNames[1] ? sortedNames[0] : `${sortedNames[0]} – ${sortedNames[1]}`;
    } else {
      // Internal zones: Always A - B where A < B alphabetically
      const nameA = formatShortName(originZone?.name || "");
      const nameB = formatShortName(destZone?.name || "");
      const sortedNames = [nameA, nameB].sort();
      label = `${sortedNames[0]} – ${sortedNames[1]}`;
    }

    // Use a composite key if no price record exists yet
    const key = price?.id || (mergedIds ? mergedIds.join(",") : `${tempPair?.originId}-${tempPair?.destId}`);
    const feeData = localLogisticsFees[price?.id || ""] || (mergedIds ? localLogisticsFees[mergedIds[0]] : null);
    const isMissing = !price?.id && (!mergedIds || mergedIds.length === 0);

    return (
      <div
        key={key}
        className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors ${isMissing ? 'bg-orange-50/20' : 'hover:bg-gray-50/50'}`}
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={feeData?.active ?? false}
            disabled={isMissing}
            onChange={(e) => {
              const idsToUpdate = mergedIds || (price?.id ? [price.id] : []);
              idsToUpdate.forEach(id => onUpdateActive(id, e.target.checked));
            }}
            className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer disabled:opacity-30"
          />
          <div className="flex flex-col">
            <span className={`text-[14px] font-medium ${feeData?.active || isMissing ? "text-[#333]" : "text-gray-400"}`}>
              {label}
            </span>
            {isMissing && <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Not Set</span>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-semibold text-gray-900 leading-none mt-0.5">₦</span>
            <input
              type="text"
              value={feeData?.price ?? "0"}
              onChange={(e) => {
                if (!isMissing) {
                   const idsToUpdate = mergedIds || (price?.id ? [price.id] : []);
                   idsToUpdate.forEach(id => onUpdatePrice(id, e.target.value));
                }
              }}
              onBlur={() => {
                if (!isMissing) {
                   const idsToUpdate = mergedIds || (price?.id ? [price.id] : []);
                   idsToUpdate.forEach(id => onBlurPrice(id));
                }
              }}
              disabled={isMissing}
              className={`w-20 bg-[#F5F5F5] border-none rounded-lg px-3 py-1.5 text-[13px] font-semibold text-right outline-none transition-opacity focus:ring-1 focus:ring-orange-200 ${feeData?.active || isMissing ? "opacity-100" : "opacity-50"}`}
            />
          </div>
          {isUpdatingPrice && !isMissing && (
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

      {hasMissingPrices && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
          <div className="mt-0.5 text-orange-600">⚠️</div>
          <div>
            <p className="text-[13px] font-bold text-orange-800">Missing price records detected</p>
            <p className="text-[12px] text-orange-700/80 leading-relaxed">
              Some zone combinations (marked as <span className="font-bold">&quot;Not Set&quot;</span>) haven&apos;t been initialized in the database. 
              Click <span className="font-bold text-orange-800">&quot;Initialize Matrix&quot;</span> above to generate these records without affecting your existing prices.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
             <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        ) : zones.length > 0 ? (
          <>
            {/* Render Groups based on UNIQUE pairs of sub-zones */}
            {zones
              .filter(z => !z.parentId)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((parent) => {
                const subZones = zones
                  .filter(z => z.parentId === parent.id)
                  .sort((a, b) => a.name.localeCompare(b.name));
                
                // If no sub-zones, just show the parent price
                if (subZones.length === 0) {
                   const parentPrice = prices.find(p => p.originZoneId === parent.id && p.destinationZoneId === parent.id);
                   return (
                    <div key={parent.id} className="space-y-4">
                      <div className="px-2">
                        <h3 className="text-[16px] font-bold text-gray-900">{parent.name}</h3>
                      </div>
                      <div className="space-y-0.5 bg-[#FCFCFC]/30 rounded-2xl p-1">
                        {renderPriceRow(parentPrice, false, !parentPrice ? { originId: parent.id, destId: parent.id } : undefined)}
                      </div>
                    </div>
                   );
                }

                // Generate unique unordered pairs (i <= j)
                const uniquePairs: [DeliveryZone, DeliveryZone][] = [];
                for (let i = 0; i < subZones.length; i++) {
                  for (let j = i; j < subZones.length; j++) {
                    uniquePairs.push([subZones[i], subZones[j]]);
                  }
                }

                return (
                  <div key={parent.id} className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[16px] font-bold text-gray-900">{parent.name}</h3>
                      <button 
                        onClick={() => handleOpenStructure(parent.id)}
                        className="flex items-center gap-1.5 text-[14px] font-bold text-gray-900 hover:opacity-70 transition-opacity"
                      >
                        Zone structure
                        <span className="text-[12px] opacity-60">❯</span>
                      </button>
                    </div>
                    <div className="space-y-0.5 bg-[#FCFCFC]/30 rounded-2xl p-1">
                      {uniquePairs.map(([origin, dest]) => {
                        // Look for price in both directions
                        const priceAB = prices.find(p => p.originZoneId === origin.id && p.destinationZoneId === dest.id);
                        const priceBA = prices.find(p => p.originZoneId === dest.id && p.destinationZoneId === origin.id);
                        
                        // Collect all IDs that belong to this merged pair
                        const mergedIds = [priceAB?.id, priceBA?.id].filter(Boolean) as string[];
                        
                        return renderPriceRow(
                          priceAB || priceBA, 
                          false, 
                          !priceAB && !priceBA ? { originId: origin.id, destId: dest.id } : undefined,
                          mergedIds
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            {/* Render Ungrouped / Inter-State */}
            {finalUngrouped.length > 0 && (
              <div className="space-y-4">
                <div className="px-2">
                  <h3 className="text-[16px] font-bold text-gray-900">
                    Inter-State / Other Pricing
                  </h3>
                </div>
                <div className="space-y-0.5 bg-[#FCFCFC]/30 rounded-2xl p-1">
                  {/* For Inter-State, we also apply the alphabetical merge logic if parents are same */}
                  {finalUngrouped.map(price => renderPriceRow(price, true))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-[15px] text-gray-500 font-medium">
              No zones found. Click &quot;Initialize Matrix&quot; to set up.
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
