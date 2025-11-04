import { createSlice } from "@reduxjs/toolkit";
import { fetchRimsDiameters, fetchTiresBySize } from "./operations";

const initialState = {
  tiresBySize: [],
  rimsDiameters: [],
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    changeFilter: (state, action) => {
      //   const { name, value } = action.payload;
      //   state[name] = value;
      state.tiresBySize = [];
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
        // console.log("Slice-action.payload:", action.payload.data);
        state.isLoading = false;
        state.tiresBySize = action.payload.data || [];
      })
      .addCase(fetchTiresBySize.rejected, (state) => {
        state.isLoading = false;
        state.tiresBySize = []; // У разі помилки очищаємо
      })

      // отримати всі можливі діаметри дисків
      .addCase(fetchRimsDiameters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRimsDiameters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rimsDiameters = action.payload || [];
      })
      .addCase(fetchRimsDiameters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { changeFilter } = slice.actions;

export const filterReducer = slice.reducer;
