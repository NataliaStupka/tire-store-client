import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addTire,
  deleteTire,
  editTire,
  fetchAllTires,
  fetchTiresByCategory,
  fetchTiresById,
} from "./operations.js";

const initialState = {
  items: [],
  tiresByCategory: [],
  tireById: null,

  favoriteTires: [],

  isLoading: false,
  isError: null,
};

const slice = createSlice({
  name: "tire",
  initialState,
  //action  //те що змінює локально
  reducers: {
    addFavoriteTire(state, action) {
      state.favoriteTires.push(action.payload);
    },
    deleteFavoriteTire: (state, action) => {
      state.favoriteTires = state.favoriteTires.filter(
        (item) => item._id !== action.payload
      );
    },
    clearTiresByCategory(state) {
      state.tiresByCategory = [];
    },
  },

  //reducer
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTires.fulfilled, (state, action) => {
        state.items = action.payload.data;
      })
      .addCase(fetchTiresByCategory.fulfilled, (state, action) => {
        state.tiresByCategory = action.payload.data;
      })
      .addCase(fetchTiresById.fulfilled, (state, action) => {
        console.log("SLICE--", action.payload);
        state.tireById = action.payload.data || action.payload;
        // state.tireById = action.payload.data;
      })
      .addCase(addTire.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteTire.fulfilled, (state, { payload }) => {
        const tireId = payload;
        state.items = state.items.filter((item) => {
          return item._id !== tireId;
        });
      })
      .addCase(editTire.fulfilled, (state, { payload }) => {
        console.log("Edit fulfilled:", payload);
        const updatedTire = payload.data; //оновлена шина
        if (updatedTire) {
          state.items = state.items.map((item) =>
            item._id === updatedTire._id ? updatedTire : item
          );
          state.tiresByCategory = state.tiresByCategory.map((item) =>
            item._id === updatedTire._id ? updatedTire : item
          );
          state.tireById = updatedTire;
        } else {
          console.warn("No updated tire data received:", payload);
        }
      })
      //-- addMatcher --//
      //== стан в очікуванні - pending
      .addMatcher(
        isAnyOf(
          fetchAllTires.pending,
          fetchTiresByCategory.pending,
          fetchTiresById.pending,
          addTire.pending,
          deleteTire.pending,
          editTire.pending
        ),
        (state) => {
          state.isLoading = true;
          state.isError = false;
        }
      )
      //== стан успіх - fulfilled
      .addMatcher(
        isAnyOf(
          fetchAllTires.fulfilled,
          fetchTiresByCategory.fulfilled,
          fetchTiresById.fulfilled,
          addTire.fulfilled,
          deleteTire.fulfilled,
          editTire.fulfilled
        ),
        (state) => {
          state.isLoading = false;
        }
      )
      //== стан помилка - regected
      .addMatcher(
        isAnyOf(
          fetchAllTires.rejected,
          fetchTiresByCategory.rejected,
          fetchTiresById.rejected,
          addTire.rejected,
          deleteTire.rejected,
          editTire.rejected
        ),
        (state, action) => {
          state.isLoading = false;
          state.isError = action.payload || true; //??
        }
      );
  },
});

export const { addFavoriteTire, deleteFavoriteTire, clearTiresByCategory } =
  slice.actions;

export const tiresReducer = slice.reducer;
