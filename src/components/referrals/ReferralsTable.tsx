import React from "react";
import { TrendingDown, Pencil } from "lucide-react";

// Types
interface Referral {
  id: string;
  name: string;
  email: string;
  referrals: number;
  amountPaid: number;
  bonus: number;
  joinedDate: string;
  isTop?: boolean;
}

interface ReferralsTableProps {
  referrals: Referral[];
}

// Avatar Component
const Avatar = ({ name, color }: { name: string; color: string }) => {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${color}`}
    >
      {initial}
    </div>
  );
};

const ReferralsTable: React.FC<ReferralsTableProps> = ({ referrals }) => {
  const colors = [
    "bg-[#E67E22]",
    "bg-[#E67E22]",
    "bg-[#E67E22]",
    "bg-[#E67E22]",
    "bg-[#E67E22]",
    "bg-[#E67E22]",
    "bg-[#E67E22]",
    "bg-[#E67E22]",
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-100">
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 tracking-wider">
              User
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 tracking-wider">
              <div className="flex items-center gap-2">
                Number of Referrals
                <TrendingDown className="w-4 h-4 text-[#E67E22]" />
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 tracking-wider">
              Amount Paid Out
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 tracking-wider">
              Bonus
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 tracking-wider">
              Joined Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {referrals.map((referral, index) => (
            <tr
              key={referral.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={referral.name} color={colors[index]} />
                  <div>
                    <div className="text-gray-900">{referral.name}</div>
                    <div className="text-sm text-gray-500">
                      {referral.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900">{referral.referrals}</span>
                  {referral.isTop && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded">
                      Top
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-900">
                  ₦{referral.amountPaid.toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900">
                    ₦{referral.bonus.toLocaleString()}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <Pencil className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-600">{referral.joinedDate}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReferralsTable;
export type { Referral };
