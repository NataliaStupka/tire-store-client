import { createSlice } from "@reduxjs/toolkit";
import { fetchRimsDiameters, fetchTiresBySize } from "./operations";

const initialState = {
  tiresBySize: [],
  rimsDiameters: [],

  // пагінація
  sizePage: 1,
  sizeTotalPages: 1,
  sizeTotalItems: 0,
  sizePerPage: 12,

  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    changeFilter: (state, action) => {
      // очищуємо результати фільтра при виборі нового
      state.tiresBySize = [];

      //скидаємо пагінацію фільтра
      state.sizePage = 1;
      state.sizeTotalPages = 1;
      state.sizeTotalItems = 0;
    },
  },
  extraReducers: (builder) => {
    //size
    builder
      .addCase(fetchTiresBySize.pending, (state, action) => {
        state.isLoading = true;

        state.tiresBySize = []; // Очищаємо перед новим запитом
      })
      .addCase(fetchTiresBySize.fulfilled, (state, action) => {
        const { data, page, totalItems, perPage, totalPages } = action.payload;
        console.log("Flter_size-payload", action.payload);
        state.isLoading = false;

        state.tiresBySize = data || [];

        state.sizePage = page;
        state.sizeTotalPages = totalPages;
        state.sizeTotalItems = totalItems;
        // state.sizePerPage = perPage;
        console.log("Flter_size-payload", action.payload);
      })
      .addCase(fetchTiresBySize.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.tiresBySize = []; // У разі помилки очищаємо
      })

      // отримати всі можливі діаметри дисків
      .addCase(fetchRimsDiameters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRimsDiameters.fulfilled, (state, action) => {
        // console.log("Slice-filter.fetchRimsDiameters:", action.payload.data);
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
