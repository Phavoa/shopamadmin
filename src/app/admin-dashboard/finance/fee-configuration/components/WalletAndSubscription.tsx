import React from "react";

interface WalletAndSubscriptionProps {
  walletFee: string;
  withdrawalFee: string;
  subscriptionEnabled: boolean;
  subscriptionPrice: string;
  referralEnabled: boolean;
  setWalletFee: (val: string) => void;
  setWithdrawalFee: (val: string) => void;
  setSubscriptionEnabled: (val: boolean) => void;
  setSubscriptionPrice: (val: string) => void;
  setReferralEnabled: (val: boolean) => void;
}

export const WalletAndSubscription: React.FC<WalletAndSubscriptionProps> = ({
  walletFee,
  withdrawalFee,
  subscriptionEnabled,
  subscriptionPrice,
  referralEnabled,
  setWalletFee,
  setWithdrawalFee,
  setSubscriptionEnabled,
  setSubscriptionPrice,
  setReferralEnabled,
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
      <h2 className="text-base font-semibold text-black mb-6">
        Wallet and Subscription
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-black">Wallet fee (fixed):</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">₦</span>
            <input
              type="text"
              value={walletFee}
              onChange={(e) => setWalletFee(e.target.value)}
              style={{
                width: "60px",
                padding: "6px 10px",
                borderRadius: "8px",
                border: "0.3px solid rgba(0, 0, 0, 0.20)",
                fontSize: "14px",
                textAlign: "right",
                outline: "none",
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-black">Withdrawal fee (fixed):</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">₦</span>
            <input
              type="text"
              value={withdrawalFee}
              onChange={(e) => setWithdrawalFee(e.target.value)}
              style={{
                width: "60px",
                padding: "6px 10px",
                borderRadius: "8px",
                border: "0.3px solid rgba(0, 0, 0, 0.20)",
                fontSize: "14px",
                textAlign: "right",
                outline: "none",
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-black">Referral system enabled:</span>
          <div className="flex items-center gap-2">
            <span className="text-sm">Yes</span>
            <input
              type="checkbox"
              checked={referralEnabled}
              onChange={() => setReferralEnabled(!referralEnabled)}
              className="w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-black">Subscription (monthly):</span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!subscriptionEnabled}
                onChange={() => setSubscriptionEnabled(false)}
                className="w-4 h-4"
              />
              <span className="text-sm">Off</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={subscriptionEnabled}
                onChange={() => setSubscriptionEnabled(true)}
                className="w-4 h-4"
              />
              <span className="text-sm">On</span>
            </label>
            <span className="text-sm ml-2">Price</span>
            <input
              type="text"
              value={subscriptionPrice}
              onChange={(e) => setSubscriptionPrice(e.target.value)}
              disabled={!subscriptionEnabled}
              style={{
                width: "60px",
                padding: "6px 10px",
                borderRadius: "8px",
                border: "0.3px solid rgba(0, 0, 0, 0.20)",
                fontSize: "14px",
                textAlign: "right",
                outline: "none",
                opacity: subscriptionEnabled ? 1 : 0.5,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
