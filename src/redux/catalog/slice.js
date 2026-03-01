import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addProduct,
  deleteProduct,
  editProduct,
  fetchRimsDiameters,
  fetchProducts,
  fetchProductById,
} from "./operations.js";
import { REHYDRATE } from "redux-persist";

const initialState = {
  searchResults: [], // пошук
  categoryResults: [], // сторінка категорії

  productById: null,
  favoriteProducts: [], // 💙

  rimsDiameters: [], // [можливі діаметри дисків]

  currentPage: 1, //page
  totalPages: 1, //null ?
  perPage: 12,

  isLoading: false,
  error: null, //error ?
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  //action  //те що змінює локально
  reducers: {
    resetPagination(state) {
      state.currentPage = 1;
    },
    addFavoriteProduct(state, action) {
      state.favoriteProducts.push(action.payload);
    },
    deleteFavoriteProduct: (state, action) => {
      state.favoriteProducts = state.favoriteProducts.filter(
        (item) => item._id !== action.payload,
      );
    },
    updateFavoriteProduct(state, action) {
      const updatedProduct = action.payload;
      state.favoriteProducts = state.favoriteProducts.map((item) =>
        item._id === updatedProduct._id ? updatedProduct : item,
      );
    },
    // ⁉️ don`t use ??
    clearCategoryResults(state) {
      state.categoryResults = [];
      state.currentPage = 1;
    },
    clearSearchResult(state) {
      state.searchResults = [];
    },
  },

  //reducer
  extraReducers: (builder) => {
    builder
      //один основний і все ??
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { data, target } = action.payload;
        console.log("👀 ⬇ DATA", action.payload);

        if (target === "SEARCH") {
          state.searchResults = data.data;
        }
        if (target === "CATEGORY") {
          state.categoryResults = data.data;
        }

        state.currentPage = data.page; //активна сторінка
        state.totalPages = data.totalPages;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productById = action.payload.data || action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.categoryResults.push(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        const productId = payload;
        state.categoryResults = state.categoryResults.filter((item) => {
          return item._id !== productId;
        });
      })
      // ???? потребує перевірки
      .addCase(editProduct.fulfilled, (state, { payload }) => {
        const updatedProduct = payload.data; //оновлена шина

        if (updatedProduct) {
          state.categoryResults = state.categoryResults.map((item) =>
            item._id === updatedProduct._id ? updatedProduct : item,
          );
          state.searchResults = state.searchResults.map((item) =>
            item._id === updatedProduct._id ? updatedProduct : item,
          );

          state.productById = updatedProduct;
        } else {
          console.warn("No updated tire data received:", payload);
        }
      })
      // отримати всі можливі діаметри дисків
      .addCase(fetchRimsDiameters.fulfilled, (state, action) => {
        console.log("🟠 diameters:", action.payload);
        state.rimsDiameters = action.payload || []; //action.payload
      })

      // очищаємо все, крім обраних, при старті
      .addCase(REHYDRATE, (state, action) => {
        if (action.key === "catalog") {
          return {
            ...initialState,
            favoriteProducts: state.favoriteProducts,
          };
        }
      })
      //-- addMatcher --//
      //== стан в очікуванні - pending
      .addMatcher(
        isAnyOf(
          fetchProducts.pending,
          fetchProductById.pending,
          addProduct.pending,
          deleteProduct.pending,
          editProduct.pending,
          fetchRimsDiameters.pending,
        ),
        (state) => {
          state.isLoading = true;
          state.error = null; // false
        },
      )
      //== стан успіх - fulfilled
      .addMatcher(
        isAnyOf(
          fetchProducts.fulfilled,
          fetchProductById.fulfilled,
          addProduct.fulfilled,
          deleteProduct.fulfilled,
          editProduct.fulfilled,
          fetchRimsDiameters.fulfilled,
        ),
        (state) => {
          state.isLoading = false;
        },
      )
      //== стан помилка - regected
      .addMatcher(
        isAnyOf(
          fetchProducts.rejected,
          fetchProductById.rejected,
          addProduct.rejected,
          deleteProduct.rejected,
          editProduct.rejected,
          fetchRimsDiameters.rejected,
        ),
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.payload || action.error?.message || "Помилка завантаження"; //?? action.payload
        },
      );
  },
});

export const {
  clearCategoryResults, // не використовую
  clearSearchResult, // ⁉️
  addFavoriteProduct,
  deleteFavoriteProduct,
  updateFavoriteProduct,
  setPage,
  resetPagination,
} = catalogSlice.actions;

export const catalogReducer = catalogSlice.reducer;
