import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HeaderState {
  headerTitle: string;
}

const initialState: HeaderState = {
  headerTitle: "",
};

export const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setHeaderTitle: (state, action: PayloadAction<string>) => {
      state.headerTitle = action.payload;
    },
    clearHeaderTitle: (state) => {
      state.headerTitle = "";
    },
  },
});

export const { setHeaderTitle, clearHeaderTitle } = headerSlice.actions;
export default headerSlice.reducer;
