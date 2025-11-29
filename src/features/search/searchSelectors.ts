import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store/store";

// Basic selectors
export const selectSearchQuery = (state: RootState) => state.search.query;
export const selectIsSearching = (state: RootState) => state.search.isSearching;
export const selectLastSearchTime = (state: RootState) =>
  state.search.lastSearchTime;

// Memoized selector for search status
export const selectSearchStatus = createSelector(
  [selectSearchQuery, selectIsSearching, selectLastSearchTime],
  (query, isSearching, lastSearchTime) => ({
    query,
    isSearching,
    lastSearchTime,
    hasQuery: query.trim().length > 0,
  })
);
