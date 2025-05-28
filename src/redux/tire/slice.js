import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addTire,
  deleteTire,
  fetchAllTires,
  fetchTiresByCategory,
} from "./operations";

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
  //action
  reducer: {
    addFavoriteTire(state, action) {
      state.favoriteTires.push(action.payload);
    },
    deleteFavoriteTire(state, action) {
      state.favoriteTires = state.favoriteTires.filter(
        (item) => item.id !== action.payload
      );
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
      .addCase(fetchTiresByCategory.fulfilled, (state, action) => {
        console.log("CATEGORY-", action.payload);
        console.dir("CATEGORY--", JSON.parse(JSON.stringify(state.items)));
        state.tiresByCategory = action.payload.data;
      })
      .addCase(addTire.fulfilled, (state, action) => {
        console.log("✅ Added tire:", action.payload);
        state.items.push(action.payload);
      })
      .addCase(deleteTire.fulfilled, (state, { payload }) => {
        const tireId = payload;
        console.log("delete-payload:", payload);
        console.dir(
          "deleteSTATE-payload_1:",
          JSON.parse(JSON.stringify(state.items))
        );
        state.items = state.items.filter((item) => {
          console.log("item!--", item);
          return item._id !== tireId;
        });
        state.tiresByCategory = state.tiresByCategory.filter(
          (item) => item._id !== tireId
        );
        console.dir(
          "deleteSTATE-payload_2:",
          state.items,
          state.tiresByCategory
        );
      })
      //-- addMatcher --//
      //== стан в очікуванні - pending
      .addMatcher(
        isAnyOf(
          fetchAllTires.pending,
          fetchTiresByCategory.pending,
          addTire.pending,
          deleteTire.pending
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
          deleteTire.fulfilled
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
          deleteTire.rejected
        ),
        (state, action) => {
          state.isLoading = false;
          //   state.isError = action.payload;
          state.isError = true; //??
        }
      );
  },
});

export const { addFavoriteTire, deleteFavoriteTire } = slice.actions;
export const tiresReducer = slice.reducer;
