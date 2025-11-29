import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  query: string;
  isSearching: boolean;
  lastSearchTime: number;
}

const initialState: SearchState = {
  query: "",
  isSearching: false,
  lastSearchTime: 0,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.lastSearchTime = Date.now();
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    clearSearch: (state) => {
      state.query = "";
      state.isSearching = false;
      state.lastSearchTime = 0;
    },
    debounceSearch: (state, action: PayloadAction<string>) => {
      // This action can be used for debounced search updates
      state.query = action.payload;
    },
  },
});

export const { setSearchQuery, setIsSearching, clearSearch, debounceSearch } =
  searchSlice.actions;
export default searchSlice.reducer;
