import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addTire,
  deleteTire,
  editTire,
  fetchAllTires,
  fetchTiresByCategory,
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
    addFavoriteTire: (state, action) => {
      state.favoriteTires.push(action.payload);
    },
    deleteFavoriteTire: (state, action) => {
      state.favoriteTires = state.favoriteTires.filter(
        (item) => item.id !== action.payload
      );
    },
    clearTiresByCategory: (state) => {
      state.tiresByCategory = [];
    },
  },

  //reducer
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTires.fulfilled, (state, action) => {
        //   const { tire } = action.payload;
        //   state.items = [...state.items, ...tire];
        state.items = action.payload.data;
      })
      //   fetch by category
      // .addCase(fetchTiresByCategory.pending, (state, actions) => {
      //   state.tiresByCategory = []; // Скидаємо список шин за категорією
      // })
      .addCase(fetchTiresByCategory.fulfilled, (state, action) => {
        // console.log("CATEGORY-", action.payload);

        state.tiresByCategory = action.payload.data;
      })
      .addCase(addTire.fulfilled, (state, action) => {
        // console.log("✅ Added tire:", action.payload);
        state.items.push(action.payload);
      })
      .addCase(deleteTire.fulfilled, (state, { payload }) => {
        const tireId = payload;
        state.items = state.items.filter((item) => {
          return item._id !== tireId;
        });
      })
      .addCase(editTire.fulfilled, (state, { payload }) => {
        console.log("Edit-Payload у slice.js:", payload);
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
