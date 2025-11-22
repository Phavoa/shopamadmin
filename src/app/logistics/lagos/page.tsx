// src/app/logistics/lagos/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Import all the new components
import KPIGrid from "@/components/logistics/KPIGrid";
import PickupRequestsTable from "@/components/logistics/PickupRequestsTable";
import DeliveriesTable from "@/components/logistics/DeliveriesTable";
import RiderStatus from "@/components/logistics/RiderStatus";
import ExceptionsTable from "@/components/logistics/ExceptionsTable";
import AddRiderModal from "@/components/logistics/AddRiderModal";
import AddShopModal from "@/components/logistics/AddShopModal";
import AssignRiderModal from "@/components/logistics/AssignRiderModal";
import TrackOrderModal from "@/components/logistics/TrackOrderModal";
import InvestigateExceptionModal from "@/components/logistics/InvestigateExceptionModal";

interface Order {
  id: string;
  seller?: string;
  buyer?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  phone: string;
  status: string;
}

interface Exception {
  order: string;
  customer: string;
  issue: string;
  address: string;
  phone: string;
  status: string;
}

interface Rider {
  name: string;
  status: string;
  color: string;
}

export default function LagosHubDashboard() {
  // Modal states
  const [showAddRiderModal, setShowAddRiderModal] = useState(false);
  const [showAddShopModal, setShowAddShopModal] = useState(false);
  const [showAssignRiderModal, setShowAssignRiderModal] = useState(false);
  const [showTrackOrderModal, setShowTrackOrderModal] = useState(false);
  const [showInvestigateModal, setShowInvestigateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string>("");

  // Mock data
  const kpis = {
    ordersToday: 128,
    pickRequests: 22,
    atHub: 44,
    waitingForDelivery: 38,
    exceptions: 4,
  };

  const pickupRequests: Order[] = [
    {
      id: "SA20016",
      seller: "John D.",
      pickupAddress: "16 Allam Ave, Ikeja",
      phone: "0802 111 222",
      status: "Pending",
    },
    {
      id: "SA20011",
      seller: "Mary K.",
      pickupAddress: "13 Bode Thomas, Surulere",
      phone: "0813 222 333",
      status: "Awaiting Seller Shipment",
    },
    {
      id: "SA20010",
      seller: "John D.",
      pickupAddress: "16 Allam Ave, Ikeja",
      phone: "0802 111 222",
      status: "In Transit to Shopam",
    },
  ];

  const deliveries: Order[] = [
    {
      id: "SA20013",
      buyer: "John D.",
      deliveryAddress: "Lekki Phase 1, Lagos",
      phone: "0802 111 222",
      status: "At Hub",
    },
    {
      id: "SA20011",
      buyer: "Mary K.",
      deliveryAddress: "13 Bode Thomas, Surulere",
      phone: "0813 222 333",
      status: "Assigned (Rider A)",
    },
    {
      id: "SA20010",
      buyer: "John D.",
      deliveryAddress: "Yaba, Lagos",
      phone: "0802 111 222",
      status: "Delivered",
    },
  ];

  const exceptions: Exception[] = [
    {
      order: "SA0018",
      customer: "Mary K.",
      issue: "Phone not reachable",
      address: "13 Bode Thomas, Surulere",
      phone: "0802 111 222",
      status: "Exception",
    },
    {
      order: "SA0019",
      customer: "Jane Doe",
      issue: "Parcel damaged at hub",
      address: "2 Platinum Way, Lekki",
      phone: "0802 111 222",
      status: "Exception",
    },
    {
      order: "SA0018",
      customer: "John D.",
      issue: "Pickup overdue >24h",
      address: "13 Bode Thomas, Surulere",
      phone: "0802 111 222",
      status: "Exception",
    },
  ];

  const riders: Rider[] = [
    { name: "Rider Paul", status: "Available", color: "green" },
    { name: "Rider Obi", status: "On Delivery", color: "blue" },
    { name: "Rider Seyi", status: "Picking Up", color: "blue-700" },
    { name: "Rider Ahmed", status: "Offline", color: "gray" },
  ];

  const handleAssignRider = (orderId: string) => {
    setSelectedOrder(orderId);
    setShowAssignRiderModal(true);
  };

  const handleInvestigate = (orderId: string) => {
    setSelectedOrder(orderId);
    setShowInvestigateModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Lagos Hub Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time logistics management and order tracking
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowAddRiderModal(true)}
            className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Rider
          </Button>

          <Button
            onClick={() => setShowAddShopModal(true)}
            className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Shop
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <KPIGrid kpis={kpis} />

      {/* Pickup Requests Table */}
      <PickupRequestsTable
        pickupRequests={pickupRequests}
        onAssignRider={handleAssignRider}
      />

      {/* Deliveries Table */}
      <DeliveriesTable
        deliveries={deliveries}
        onAssignRider={handleAssignRider}
        onTrackOrder={() => setShowTrackOrderModal(true)}
      />

      {/* Rider Status */}
      <RiderStatus riders={riders} />

      {/* Exceptions Table */}
      <ExceptionsTable
        exceptions={exceptions}
        onInvestigate={handleInvestigate}
      />

      {/* Modals */}
      <AddRiderModal
        isOpen={showAddRiderModal}
        onClose={() => setShowAddRiderModal(false)}
      />

      <AddShopModal
        isOpen={showAddShopModal}
        onClose={() => setShowAddShopModal(false)}
      />

      <AssignRiderModal
        isOpen={showAssignRiderModal}
        onClose={() => setShowAssignRiderModal(false)}
      />

      <TrackOrderModal
        isOpen={showTrackOrderModal}
        onClose={() => setShowTrackOrderModal(false)}
      />

      <InvestigateExceptionModal
        isOpen={showInvestigateModal}
        onClose={() => setShowInvestigateModal(false)}
        selectedOrder={selectedOrder}
      />
    </div>
  );
}
