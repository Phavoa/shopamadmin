"use client";

import React from "react";
import { Play, ShoppingBag, TrendingUp, MessageSquare, Gift, Package } from "lucide-react";

export default function LiveMonitoringPage() {
  // Mock data for activity feed
  const activities = [
    {
      id: 1,
      icon: <Package className="w-4 h-4" />,
      text: "Buyer John B. purchased iPhone 12 - ₦320,000",
    },
    {
      id: 2,
      icon: <TrendingUp className="w-4 h-4" />,
      text: "Buyer Mary K. bid ₦45,000 on Samsung Galaxy A20",
    },
    {
      id: 3,
      icon: <Package className="w-4 h-4" />,
      text: "Buyer Ahmed H. purchased AirPods - ₦60,000",
    },
    {
      id: 4,
      icon: <MessageSquare className="w-4 h-4" />,
      text: 'Buyer Jane T. "fake products?"',
    },
    {
      id: 5,
      icon: <Package className="w-4 h-4" />,
      text: "Buyer John B. purchased iPhone 12 - ₦320,000",
    },
    {
      id: 6,
      icon: <Gift className="w-4 h-4" />,
      text: "Buyer Sam O. sent a gift (5 tokens)",
    },
    {
      id: 7,
      icon: <Package className="w-4 h-4" />,
      text: "Buyer John B. purchased iPhone 12 - ₦320,000",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[rgba(0,0,0,0.9)]">
          Live Monitoring - Maxi Gadgets
        </h1>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Preview Card - Takes 2 columns */}
        <div
          className="lg:col-span-2 bg-white p-5"
          style={{
            borderRadius: "18px",
            border: "0.3px solid rgba(0, 0, 0, 0.20)",

          }}
        >
          <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)] mb-4">
            Live Preview
          </h2>

          {/* Video Preview */}
          <div
            className="relative bg-[#1a1a2e] rounded-lg flex items-center justify-center"
            style={{ height: "600px" }}
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#E67E22] flex items-center justify-center mx-auto mb-3">
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </div>
              <p className="text-white text-lg font-medium">Live Video Preview</p>
            </div>
          </div>

          {/* Video Stats */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-[rgba(0,0,0,0.7)]">Viewers: 320</p>
            <p className="text-sm text-[rgba(0,0,0,0.7)]">
              Stream Health: <span className="text-green-600">Good</span> (2s latency)
            </p>
          </div>
        </div>

        {/* Activity Feed Card - Takes 1 column */}
        <div
          className="bg-white p-5"
          style={{
            borderRadius: "18px",
            border: "0.3px solid rgba(0, 0, 0, 0.20)",
            height:"500px"
          }}
        >
          <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)] mb-4">
            Activity Feed
          </h2>

          {/* Activities List */}
          <div className="space-y-10 max-h-[400px] overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-1 text-[rgba(0,0,0,0.6)]">
                  {activity.icon}
                </div>
                <p className="text-sm text-[rgba(0,0,0,0.8)] leading-relaxed">
                  {activity.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Controls and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Admin Controls Card - Takes 2 columns */}
        <div
          className="lg:col-span-2 bg-white p-5"
          style={{
            borderRadius: "18px",
            border: "0.3px solid rgba(0, 0, 0, 0.20)",
            height:"150px",
          }}
        >
          <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)] mb-4">
            Admin Controls
          </h2>

          <div className="flex flex-wrap gap-3">
            <button
              className="px-6 py-3 rounded-lg font-medium text-white transition-colors"
              style={{
                background: "#E67E22",
              }}
            >
              Add Strike to Seller
            </button>
            <button
              className="px-6 py-3 rounded-lg font-medium border transition-colors"
              style={{
                border: "1px solid rgba(0, 0, 0, 0.2)",
                color: "rgba(0, 0, 0, 0.7)",
              }}
            >
              Issue Warning to Seller
            </button>
            <button
              className="px-6 py-3 rounded-lg font-medium text-white transition-colors"
              style={{
                background: "#DC3545",
              }}
            >
              End Live
            </button>
          </div>
        </div>

        {/* Insights Card - Takes 1 column */}
        <div
          className="bg-white p-5 mt-[-200]"
          style={{
            borderRadius: "18px",
            border: "0.3px solid rgba(0, 0, 0, 0.20)",
            height:"350px"
          }}
        >
          <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)] mb-4">
            Insights
          </h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-[rgba(0,0,0,0.7)]">
                Total Sales this Stream: <span className="font-semibold text-[rgba(0,0,0,0.9)]">₦620,000</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-[rgba(0,0,0,0.7)]">
                Products Sold: <span className="font-semibold text-[rgba(0,0,0,0.9)]">12</span>
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[rgba(0,0,0,0.9)] mb-2">
                Top Buyers:
              </p>
              <ol className="text-sm text-[rgba(0,0,0,0.7)] space-y-1 ml-4">
                <li>1. John B. - ₦320,000</li>
                <li>2. Ahmed H. - ₦120,000</li>
                <li>3. Mary K. - ₦30,000</li>
              </ol>
            </div>
            <div>
              <p className="text-sm text-[rgba(0,0,0,0.7)]">
                Engagement: <span className="font-semibold text-[rgba(0,0,0,0.9)]">Avg watch 14m | Peak 340 viewers</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}