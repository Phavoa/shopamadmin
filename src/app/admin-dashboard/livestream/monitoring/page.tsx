"use client";

import React from "react";

const Page = () => {
  return (
    <div className="flex-1 space-y-6 py-10">
      <div className="flex gap-6">
        <div className="flex-1 border-t rounded-xl">
          <div className="border-[#EAEAEB] shadow-[0_1px_2px_rgba(77,86,80,0.06)] rounded-lg">
            <div className="px-6 py-6">
              <div className="text-lg font-semibold text-[#0f1720]">
                Live Monitoring
              </div>
              <p className="text-sm text-[#4D5650] mt-2">
                Monitor active livestreams and performance metrics
              </p>
            </div>
            <div className="px-6 pb-6">
              <div className="text-center py-12">
                <p className="text-[#9ca3af]">
                  Live monitoring functionality coming soon...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
