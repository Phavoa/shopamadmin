import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useGetOrdersQuery } from "@/api/orderApi";
import { getUserDisciplineSummary } from "@/api/disciplineApi";
import type { Order } from "@/api/orderApiRTK";

interface WalletSummary {
  balanceKobo: string;
  linkedBanksCount: number;
}

interface SelectedBuyer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
  followersCount?: number;
  followingCount?: number;
}

interface BuyerProfileViewProps {
  selectedBuyer: SelectedBuyer;
  onBack: () => void;
}

const BuyerProfileView: React.FC<BuyerProfileViewProps> = ({
  selectedBuyer,
  onBack,
}) => {
  // Use RTK Query hook for orders
  const { data: ordersResponse, isLoading: ordersLoading } = useGetOrdersQuery({
    buyerId: selectedBuyer?.id,
    populate: [
      "items",
      "items.product",
      "buyer",
      "seller",
      "seller.user",
      "checkoutSession",
      "shipment",
      "shipment.events",
    ],
    limit: 100,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalSpend: 0,
    refundRate: "0%",
    lastPurchase: "",
  });
  const [wallet, setWallet] = useState<WalletSummary>({
    balanceKobo: "0",
    linkedBanksCount: 0,
  });
  const [disciplineData, setDisciplineData] = useState({
    activeStrikes: 0,
    isSuspended: false,
    status: "Active",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyerData = async () => {
      if (!selectedBuyer?.id) return;

      try {
        setLoading(true);

        // Orders are now fetched via RTK Query hook
        const fetchedOrders = ordersResponse?.data?.items || [];
        setOrders(fetchedOrders);

        // Calculate order statistics
        const total = fetchedOrders.length;
        const completed = fetchedOrders.filter(
          (o: Order) =>
            o.status.toLowerCase() === "completed" ||
            o.status.toLowerCase() === "delivered"
        ).length;
        const pending = fetchedOrders.filter(
          (o: Order) =>
            o.status.toLowerCase() === "pending" ||
            o.status.toLowerCase() === "processing"
        ).length;
        const refunded = fetchedOrders.filter(
          (o: Order) =>
            o.status.toLowerCase() === "refunded" ||
            o.status.toLowerCase() === "cancelled"
        ).length;

        const totalSpendKobo = fetchedOrders
          .filter(
            (o: Order) =>
              o.status.toLowerCase() === "completed" ||
              o.status.toLowerCase() === "delivered"
          )
          .reduce(
            (sum: number, o: Order) => sum + parseInt(o.totalKobo || "0"),
            0
          );

        const refundRateCalc =
          total > 0 ? ((refunded / total) * 100).toFixed(0) : "0";

        const lastOrder = fetchedOrders[0];
        const lastPurchaseDate = lastOrder
          ? new Date(lastOrder.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "";

        setOrderStats({
          totalOrders: total,
          completedOrders: completed,
          pendingOrders: pending,
          totalSpend: totalSpendKobo / 100,
          refundRate: `${refundRateCalc}%`,
          lastPurchase: lastPurchaseDate,
        });

        // Fetch discipline data
        try {
          const discipline = await getUserDisciplineSummary(selectedBuyer.id);
          const activeStrikes = discipline.activeStrikes || 0;
          const isSuspended = discipline.isSuspended || false;
          const activeSuspensions = discipline.activeSuspensions || 0;

          // Determine status based on discipline data
          let status = "Active";
          if (isSuspended || activeSuspensions > 0) {
            status = "Suspended";
          } else if (activeStrikes >= 3) {
            status = "Suspended"; // Auto-suspended due to 3 strikes
          } else if (activeStrikes > 0) {
            status = `Strike ${activeStrikes}/3`;
          }

          setDisciplineData({
            activeStrikes,
            isSuspended,
            status,
          });
        } catch (err) {
          console.error("Failed to fetch discipline data:", err);
          setDisciplineData({
            activeStrikes: 0,
            isSuspended: false,
            status: "Active",
          });
        }

        // Fetch wallet data
        try {
          const token =
            localStorage.getItem("authToken") ||
            sessionStorage.getItem("authToken");
          const walletResponse = await fetch(
            `https://shapam-ecomerce-backend.onrender.com/api/wallet/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (walletResponse.ok) {
            const walletData = await walletResponse.json();
            setWallet({
              balanceKobo: walletData.data?.balanceKobo || "0",
              linkedBanksCount: walletData.data?.linkedBanksCount || 0,
            });
          }
        } catch (err) {
          console.error("Failed to fetch wallet data:", err);
        }
      } catch (error) {
        console.error("Error fetching buyer data:", error);
      } finally {
        // Only set loading to false if orders are also loaded
        if (!ordersLoading) {
          setLoading(false);
        }
      }
    };

    // Only fetch additional data if orders are loaded
    if (!ordersLoading) {
      fetchBuyerData();
    }
  }, [selectedBuyer?.id, ordersResponse, ordersLoading]);

  // Refresh discipline data when selectedBuyer changes (for when coming from updated list)
  useEffect(() => {
    if (selectedBuyer?.id) {
      const refreshDisciplineData = async () => {
        try {
          const discipline = await getUserDisciplineSummary(selectedBuyer.id);
          const activeStrikes = discipline.activeStrikes || 0;
          const isSuspended = discipline.isSuspended || false;
          const activeSuspensions = discipline.activeSuspensions || 0;

          // Determine status based on discipline data
          let status = "Active";
          if (isSuspended || activeSuspensions > 0) {
            status = "Suspended";
          } else if (activeStrikes >= 3) {
            status = "Suspended"; // Auto-suspended due to 3 strikes
          } else if (activeStrikes > 0) {
            status = `Strike ${activeStrikes}/3`;
          }

          setDisciplineData({
            activeStrikes,
            isSuspended,
            status,
          });
        } catch (err) {
          console.error("Failed to refresh discipline data:", err);
        }
      };

      refreshDisciplineData();
    }
  }, [selectedBuyer?.id]);

  // Update loading state based on orders loading
  useEffect(() => {
    if (!ordersLoading) {
      // Orders are loaded, check if we need to set loading to false
      // This will be handled by the fetchBuyerData finally block
    }
  }, [ordersLoading]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "completed" || statusLower === "delivered") {
      return "bg-green-50 text-green-700";
    } else if (statusLower === "pending" || statusLower === "processing") {
      return "bg-orange-50 text-orange-700";
    } else if (statusLower === "refunded" || statusLower === "cancelled") {
      return "bg-red-50 text-red-700";
    }
    return "bg-gray-50 text-gray-700";
  };

  const getDisplayStatus = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "completed") {
      return "Completed";
    } else if (statusLower === "refunded") {
      return "Refunded";
    } else {
      return "Pending";
    }
  };

  const walletBalanceNaira = parseInt(wallet.balanceKobo) / 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Buyers List</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Main Profile */}
          <div className="col-span-2 space-y-6">
            {/* Buyer Header Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Avatar at top far left - positioned absolutely */}
              <div className="relative">
                <div className="absolute -top-2 right-0 w-10 h-10 rounded-full bg-white border border-black flex items-center justify-center text-black font-semibold text-sm z-10">
                  {selectedBuyer?.firstName?.[0]}
                  {selectedBuyer?.lastName?.[0]}
                </div>

                {/* Title with padding to avoid avatar overlap */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Buyer Profile - {selectedBuyer?.firstName}{" "}
                    {selectedBuyer?.lastName} (B-
                    {selectedBuyer?.id?.slice(0, 5)}) Joined
                  </h2>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6 mb-6 mt-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Spend</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {loading ? "..." : formatCurrency(orderStats.totalSpend)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Orders</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {loading ? "..." : orderStats.totalOrders}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Completed Orders</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {loading ? "..." : orderStats.completedOrders}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pending Orders</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {loading ? "..." : orderStats.pendingOrders}
                  </p>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-4 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Refund Rate</p>
                  <p className="text-base font-medium text-gray-900">
                    {loading ? "..." : orderStats.refundRate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Purchase</p>
                  <p className="text-base font-medium text-gray-900">
                    {loading ? "..." : orderStats.lastPurchase || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Verified</p>
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded bg-green-50 text-green-700">
                    Yes
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                      disciplineData.status === "Suspended"
                        ? "bg-red-50 text-red-700"
                        : disciplineData.status.includes("Strike")
                        ? "bg-orange-50 text-orange-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {disciplineData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Buyer Information Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Buyer Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Buyer ID: </span>
                  <span className="text-sm text-gray-900">
                    B-{selectedBuyer?.id?.slice(0, 8)}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Joined: </span>
                  <span className="text-sm text-gray-900">
                    {selectedBuyer?.createdAt
                      ? new Date(selectedBuyer.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Email: </span>
                  <span className="text-sm text-gray-900">
                    {selectedBuyer?.email || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Phone: </span>
                  <span className="text-sm text-gray-900">
                    {selectedBuyer?.phone || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column - Wallet & Disputes */}
          <div className="space-y-6">
            {/* Wallet & Security Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Wallet & Security
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 pb-3 border-b border-gray-100">
                  <span className="text-xs text-gray-500">Wallet Balance</span>
                  <span className="text-xs text-gray-500">Linked Bank</span>
                  <span className="text-xs text-gray-500">Last Purchase</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pb-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-900">
                    {loading ? "..." : formatCurrency(walletBalanceNaira)}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {loading ? "..." : wallet.linkedBanksCount}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {loading ? "..." : orderStats.lastPurchase || "N/A"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-100">
                  <span className="text-xs text-gray-500">Verification</span>
                  <span className="text-xs text-gray-500">2FA</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600 text-center">
                    Unverified
                  </span>
                  <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded text-center">
                    Disabled
                  </span>
                </div>
              </div>
            </div>

            {/* Disputes / Reports Card - Made Bigger */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[200px]">
              <h3 className="text-base font-semibold text-gray-900 mb-6">
                Disputes / Reports
              </h3>

              <div className="space-y-4">
                {disciplineData.activeStrikes > 0 && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm font-medium text-orange-900 mb-1">
                      Active Strikes
                    </p>
                    <p className="text-lg font-semibold text-orange-700">
                      {disciplineData.activeStrikes}/3
                    </p>
                  </div>
                )}
                {disciplineData.isSuspended && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-900 mb-1">
                      Account Status
                    </p>
                    <p className="text-sm text-red-700">Currently suspended</p>
                  </div>
                )}
                {!disciplineData.isSuspended &&
                  disciplineData.activeStrikes === 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-900 mb-1">
                        Dispute Status
                      </p>
                      <p className="text-sm text-green-700">
                        No open disputes currently
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        This buyer has a clean record
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
          {/* Recent Orders - Full Width Card */}
          <div className="bg-white rounded-lg border border-gray-200 min-h-[300px] col-span-3">
            <div className="flex items-center justify-between p-6 pb-4 ">
              <h3 className="text-base font-semibold text-gray-900">
                Recent Orders
              </h3>
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                See all orders
              </button>
            </div>

            {ordersLoading || loading ? (
              <div className="text-center py-8 text-gray-500 px-6">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500 px-6">
                No orders found
              </div>
            ) : (
              <div className="w-full">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 w-[15%]">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 w-[12%]">
                        Date
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 w-[18%]">
                        Seller
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 w-[25%]">
                        Items
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 w-[15%]">
                        Amount
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 w-[15%]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-6 text-sm text-gray-900">
                          {order.orderCode}
                        </td>
                        <td className="py-3 px-6 text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="py-3 px-6 text-sm text-gray-900">
                          {order.sellerProfile?.shopName || "N/A"}
                        </td>
                        <td className="py-3 px-6">
                          {order.items?.[0] ? (
                            <span className="py-3 px-6 text-sm text-gray-900">
                              {order.items[0].title}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-900">
                              No items
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-sm text-gray-900">
                          {formatCurrency(
                            parseInt(order.totalKobo || "0") / 100
                          )}
                        </td>
                        <td className="py-3 px-6">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                              order.status
                            )}`}
                          >
                            {getDisplayStatus(order.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerProfileView;
