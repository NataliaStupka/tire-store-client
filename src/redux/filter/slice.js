import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: "",
  size: "",
  diameter: null,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter(state, action) {
      console.log(action.payload); // {size: '15', category: 'rims'} - SearchBar

      return { ...state, ...action.payload };
    },
    resetFilter(state) {
      state.category = "";
      state.size = "";
      state.diameter = null;
    },
  },
});

export const { setFilter, resetFilter } = filterSlice.actions;

export const filterReducer = filterSlice.reducer;
