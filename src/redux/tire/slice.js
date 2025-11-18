import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addTire,
  deleteTire,
  editTire,
  fetchAllTires,
  fetchTiresByCategory,
  fetchTiresById,
} from "./operations.js";
import { REHYDRATE } from "redux-persist";

const initialState = {
  items: [],
  tiresByCategory: [],
  tireById: null,

  favoriteTires: [],

  currentPage: 1, //page
  perPage: 12,
  totalPages: null,

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
    updateFavoriteTire(state, action) {
      const updatedTire = action.payload;
      state.favoriteTires = state.favoriteTires.map((item) =>
        item._id === updatedTire._id ? updatedTire : item
      );
    },
    clearTiresByCategory(state) {
      state.tiresByCategory = [];
      state.currentPage = 1;
    },
  },

  //reducer
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTires.fulfilled, (state, action) => {
        state.items = action.payload.data;
      })
      .addCase(fetchTiresByCategory.fulfilled, (state, action) => {
        const { data, page, totalPages, append } = action.payload;
        console.log("Payload_totalPages", totalPages);

        if (append) {
          // LoadMore
          state.tiresByCategory = [...state.tiresByCategory, ...data];
        } else {
          state.tiresByCategory = data;
        }

        state.currentPage = page;
        state.totalPages = totalPages;
      })
      .addCase(fetchTiresById.fulfilled, (state, action) => {
        state.tireById = action.payload.data || action.payload;
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
      // очищаємо все, крім обраних, при старті
      .addCase(REHYDRATE, (state, action) => {
        if (action.key === "tire") {
          return {
            ...initialState,
            favoriteTires: state.favoriteTires,
          };
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

//console.log("caseReducers", slice.caseReducers);
export const {
  addFavoriteTire,
  deleteFavoriteTire,
  clearTiresByCategory,
  updateFavoriteTire,
} = slice.actions;

export const tiresReducer = slice.reducer;
