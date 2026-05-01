"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Loader2, 
  AlertCircle, 
  ArrowLeft, 
  Edit2, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  RefreshCw
} from "lucide-react";
import { useGetSystemConfigsQuery } from "@/api/systemConfigApi";
import { EditConfigModal } from "@/components/admin/settings/EditConfigModal";
import { format } from "date-fns";
import { koboToNaira, formatNaira } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";

const SystemConfigPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [after, setAfter] = useState<string | undefined>(undefined);
  const [before, setBefore] = useState<string | undefined>(undefined);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; config: any | null }>({
    isOpen: false,
    config: null,
  });

  useEffect(() => {
    dispatch(setHeaderTitle("System Configuration"));
  }, [dispatch]);

  const { data: configResponse, isLoading, error, isFetching, refetch } = useGetSystemConfigsQuery({
    q: searchQuery || undefined,
    limit: 20,
    after,
    before,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  const configs = configResponse?.data?.items || [];

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setAfter(undefined);
    setBefore(undefined);
  };

  const formatValue = (key: string, value: string) => {
    if (key.toLowerCase().includes("kobo")) {
      return formatNaira(koboToNaira(parseInt(value)));
    }
    if (value === "true") return <span className="text-green-600 font-bold">Enabled</span>;
    if (value === "false") return <span className="text-red-600 font-bold">Disabled</span>;
    
    // Try to format JSON if it looks like it
    if (value.startsWith("{") || value.startsWith("[")) {
      try {
        const parsed = JSON.parse(value);
        return <span className="text-gray-500 font-mono text-xs">{JSON.stringify(parsed).slice(0, 30)}...</span>;
      } catch (e) {
        return value;
      }
    }
    
    return value;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-gray-200 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin-dashboard/settings")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-black">System Configuration</h1>
            <p className="text-sm text-gray-500">Manage platform-wide settings and variables</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by key..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full md:w-[300px] h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button 
            onClick={() => refetch()}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Config Key</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Current Value</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Updated</th>
              <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-[#E67E22]" />
                    <p className="text-sm text-gray-500 font-medium">Fetching configurations...</p>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-red-500">
                    <AlertCircle className="w-10 h-10" />
                    <p className="font-semibold">Failed to load system configs</p>
                    <button 
                      onClick={() => refetch()}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-sm transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </td>
              </tr>
            ) : configs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                      <Settings className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No configuration keys found</p>
                    {searchQuery && (
                      <button 
                        onClick={() => handleSearch("")}
                        className="text-[#E67E22] text-sm hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              configs.map((config) => (
                <tr key={config.key} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="text-sm font-mono font-medium text-gray-900 group-hover:text-[#E67E22] transition-colors">
                      {config.key}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-700 font-medium">
                      {formatValue(config.key, config.value)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-500">
                      {config.updatedAt ? format(new Date(config.updatedAt), "MMM d, yyyy • HH:mm") : "Never"}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setEditModal({ isOpen: true, config })}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#E67E22] hover:text-[#E67E22] transition-all shadow-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && !error && configs.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <div className="text-sm text-gray-500 font-medium">
            {isFetching ? (
              <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Updating...</span>
            ) : (
              `Showing ${configs.length} configuration items`
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setBefore(configs[0]?.key);
                setAfter(undefined);
              }}
              disabled={isLoading || isFetching || !configResponse?.data?.hasPrev}
              className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => {
                setAfter(configs[configs.length - 1]?.key);
                setBefore(undefined);
              }}
              disabled={isLoading || isFetching || !configResponse?.data?.hasNext}
              className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditConfigModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, config: null })}
        config={editModal.config}
      />
    </div>
  );
};

export default SystemConfigPage;
