import React from "react";
import { X } from "lucide-react";
import type { DeliveryZone } from "@/api/deliveryApi";

interface ZoneStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: DeliveryZone[];
  parentZoneId: string | null;
}

export const ZoneStructureModal: React.FC<ZoneStructureModalProps> = ({ 
  isOpen, 
  onClose, 
  zones, 
  parentZoneId 
}) => {
  if (!isOpen || !parentZoneId) return null;

  const parentZone = zones.find(z => z.id === parentZoneId);
  const subZones = zones
    .filter(z => z.parentId === parentZoneId)
    .sort((a, b) => a.name.localeCompare(b.name));

  const formatShortName = (name: string) => {
    if (!name) return name;
    return name.split(/[—\-\–]/)[0].trim();
  };

  const getAreas = (description?: string) => {
    if (!description) return [];
    // Split by comma or semicolon if it's a list
    return description.split(/[,;]/).map(s => s.trim()).filter(Boolean);
  };

  const midpoint = Math.ceil(subZones.length / 2);
  const leftColumn = subZones.slice(0, midpoint);
  const rightColumn = subZones.slice(midpoint);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[24px] w-full max-w-[800px] shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-4">
          <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">
            {parentZone?.name || "Zone"} Structure
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-8 pt-2">
          <div className="bg-[#FFF4EA]/50 rounded-[20px] p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative">
              {/* Vertical Divider */}
              {subZones.length > 1 && (
                <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[1px] bg-black/10 -translate-x-1/2" />
              )}

              {/* Left Column */}
              <div className="space-y-10">
                {leftColumn.map((zone) => (
                  <div key={zone.id} className="space-y-4">
                    <h3 className="text-[16px] font-bold text-gray-900">
                      {zone.name}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-[14px] font-semibold text-gray-500 mb-2">Areas:</p>
                      <ul className="space-y-1.5">
                        {getAreas(zone.description).map((area, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[14px] font-medium text-gray-700">
                            <span className="text-gray-400 mt-0.5">•</span>
                            {area}
                          </li>
                        ))}
                        {getAreas(zone.description).length === 0 && (
                          <li className="text-[13px] italic text-gray-400">No specific areas listed</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-10">
                {rightColumn.map((zone) => (
                  <div key={zone.id} className="space-y-4 md:pl-4">
                    <h3 className="text-[16px] font-bold text-gray-900">
                      {zone.name}
                    </h3>
                    <div className="space-y-1">
                      <div className="flex flex-col items-end md:items-start text-right md:text-left">
                        <p className="text-[14px] font-semibold text-gray-500 mb-2 w-full">Areas:</p>
                        <ul className="space-y-1.5 w-full">
                          {getAreas(zone.description).map((area, idx) => (
                            <li key={idx} className="flex items-start justify-end md:justify-start gap-2 text-[14px] font-medium text-gray-700">
                              <span className="text-gray-400 mt-0.5 order-last md:order-first">•</span>
                              {area}
                            </li>
                          ))}
                          {getAreas(zone.description).length === 0 && (
                            <li className="text-[13px] italic text-gray-400">No specific areas listed</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
