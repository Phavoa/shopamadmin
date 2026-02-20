import React, { useEffect, useState } from "react";
import ReferralsHeader from "./ReferralsHeader";
import ReferralsTable from "./ReferralsTable";
import ReferralsPagination from "./ReferralsPagination";
import { setHeaderTitle } from "@/features/shared/headerSice";
import { useDispatch } from "react-redux";
import { useGetAllReferralsQuery } from "@/api/referralApi";

const ITEMS_PER_PAGE = 5;

const ReferralsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [afterCursor, setAfterCursor] = useState<string | undefined>(undefined);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);

  const { data, isLoading, isError, isFetching } = useGetAllReferralsQuery({
    limit: ITEMS_PER_PAGE,
    after: afterCursor,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  useEffect(() => {
    dispatch(setHeaderTitle("Referrals"));
  }, [dispatch]);

  // ✅ Correct field paths from actual API response
  const items = data?.data?.items ?? [];
  const hasNext = data?.data?.hasNext ?? false;
  const hasPrev = data?.data?.hasPrev ?? false;
  const nextCursor = data?.data?.nextCursor;

  // ✅ Fixed field mapping based on actual API response
  const referrals = items.map((r: any) => {
    const firstName = r.referee?.firstName ?? "";
    const lastName = r.referee?.lastName ?? "";
    const fullName =
      firstName || lastName
        ? `${firstName} ${lastName}`.trim()
        : "Unknown User";

    return {
      id: r.id,
      name: fullName,
      email: r.referee?.email ?? "No email",
      referrals: r.rewards?.length ?? 0,
      amountPaid: Math.round(Number(r.totalSpendKobo ?? 0) / 100),        // ✅ kobo → naira
      bonus: Math.round(Number(r.totalRewardsEarnedKobo ?? 0) / 100),     // ✅ correct field
      joinedDate: new Date(r.createdAt).toLocaleDateString("en-NG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      referralCode: r.code,
    };
  });

  const handleNextPage = () => {
    if (hasNext && nextCursor) {
      setCursorHistory((prev) => [...prev, afterCursor ?? ""]);
      setAfterCursor(nextCursor);
      setCurrentPage((p) => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const history = [...cursorHistory];
      const prev = history.pop();
      setCursorHistory(history);
      setAfterCursor(prev || undefined);
      setCurrentPage((p) => p - 1);
    }
  };

  const handleBack = () => {
    window.location.href = "/admin-dashboard/settings";
  };

  return (
    <div className="min-h-screen">
      <main className="px-4 py-8">
        <ReferralsHeader onBack={handleBack} />

        <div className="bg-white rounded-lg shadow-none border border-gray-200">
          {/* Skeleton loading state */}
          {(isLoading || isFetching) && (
            <div className="flex flex-col gap-3 p-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && !isLoading && (
            <div className="flex items-center justify-center py-16 text-red-500 text-sm">
              Failed to load referrals. Please try again.
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && referrals.length === 0 && (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
              No referrals found.
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && referrals.length > 0 && (
            <>
              <ReferralsTable referrals={referrals} />
              <ReferralsPagination
                totalItems={referrals.length}
                currentPage={currentPage}
                itemsPerPage={ITEMS_PER_PAGE}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
                hasNext={hasNext}
                hasPrev={hasPrev || currentPage > 1}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReferralsPage;