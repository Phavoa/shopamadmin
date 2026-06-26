"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useUpdateSystemConfigMutation } from "@/api/systemConfigApi";
import { koboToNaira, nairaToKobo, formatNaira } from "@/lib/utils";

interface EditConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: {
    key: string;
    value: string;
  } | null;
}

export const EditConfigModal: React.FC<EditConfigModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [value, setValue] = useState("");
  const [updateConfig, { isLoading }] = useUpdateSystemConfigMutation();

  useEffect(() => {
    if (config) {
      // If it's a kobo value, convert to naira for the input
      if (config.key.toLowerCase().includes("kobo")) {
        setValue(koboToNaira(parseInt(config.value)).toString());
      } else {
        setValue(config.value);
      }
    }
  }, [config]);

  if (!isOpen || !config) return null;

  const handleSave = async () => {
    try {
      let finalValue = value;
      // If it's a kobo value, convert back to kobo for the API
      if (config.key.toLowerCase().includes("kobo")) {
        finalValue = nairaToKobo(parseFloat(value)).toString();
      }
      
      await updateConfig({ key: config.key, value: finalValue }).unwrap();
      onClose();
    } catch (err: any) {
      alert(`Failed to update config: ${err?.data?.message || err.message}`);
    }
  };

  const isBoolean = config.value === "true" || config.value === "false";
  const isKobo = config.key.toLowerCase().includes("kobo");
  const isNumber = !isNaN(Number(config.value)) && !isBoolean;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Edit Configuration</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Configuration Key
            </label>
            <div className="text-sm font-mono bg-gray-50 p-2 rounded border border-gray-100 text-gray-600">
              {config.key}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Value {isKobo && "(in Naira)"}
            </label>
            
            {config.key === "ACTIVE_PAYMENT_PROVIDER" ? (
              <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] bg-white"
              >
                <option value="PAYSTACK">Paystack</option>
                <option value="FLUTTERWAVE">Flutterwave</option>
                <option value="MONNIFY">Monnify</option>
              </select>
            ) : isBoolean ? (
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value === "true"}
                    onChange={(e) => setValue(e.target.checked ? "true" : "false")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E67E22]"></div>
                </label>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {value}
                </span>
              </div>
            ) : isNumber || isKobo ? (
              <div className="relative">
                {isKobo && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    ₦
                  </span>
                )}
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className={`w-full ${isKobo ? 'pl-7' : 'px-4'} py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]`}
                  placeholder="Enter value"
                />
              </div>
            ) : (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full h-24 p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] resize-none"
                placeholder="Enter value"
              />
            )}
            
            {isKobo && !isNaN(parseFloat(value)) && (
              <p className="mt-1 text-[10px] text-gray-400">
                Will be saved as {nairaToKobo(parseFloat(value))} kobo
              </p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-[#E67E22] text-white font-bold rounded-xl hover:bg-[#cf711d] transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
