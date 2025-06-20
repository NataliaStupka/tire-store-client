import { createSlice } from "@reduxjs/toolkit";
import { fetchTiresBySize } from "./operations";

const initialState = {
  tiresBySize: [],
  isLoading: false,
};

const slice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    changeFilter: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
  },
  extraReducers: (builder) => {
    //size
    builder
      .addCase(fetchTiresBySize.pending, (state) => {
        state.isLoading = true;
        state.tiresBySize = []; // Очищаємо перед новим запитом
      })
      .addCase(fetchTiresBySize.fulfilled, (state, action) => {
        console.log("Slice-action.payload:", action.payload.data);
        state.isLoading = false;
        state.tiresBySize = action.payload.data || []; //??? action.payload.data;
      })
      .addCase(fetchTiresBySize.rejected, (state) => {
        state.isLoading = false;
        state.tiresBySize = []; // У разі помилки очищаємо
      });
  },
});

export const { changeFilter } = slice.actions;

export const filterReducer = slice.reducer;
