import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addProduct,
  deleteProduct,
  editProduct,
  fetchRimsDiameters,
  fetchProducts,
  fetchProductById,
  fetchProductsOfDay,
  setProductOfDay,
} from "./operations.js";
import { REHYDRATE } from "redux-persist";

const initialState = {
  searchResults: [], // пошук
  hasSearched: false,
  categoryResults: [], // сторінка категорії

  productById: null,
  favoriteProducts: [], // 💙
  productsOfDay: [], // ⭐️

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
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    // 💙
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
      state.hasSearched = false;
      state.currentPage = 1;
    },
  },

  //reducer
  extraReducers: (builder) => {
    builder
      //один основний і все ??
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { data, target } = action.payload;

        if (target === "SEARCH") {
          state.searchResults = data.data;
          state.hasSearched = true;
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
      .addCase(editProduct.fulfilled, (state, { payload }) => {
        const updatedProduct = payload.data; //оновлена шина
        //const updatedProduct = payload.data?.tire; //????? чи так
        console.log("updatedProduct перевірка:", updatedProduct);

        if (updatedProduct) {
          state.categoryResults = state.categoryResults.map((item) =>
            item._id === updatedProduct._id ? updatedProduct : item,
          );
          state.searchResults = state.searchResults.map((item) =>
            item._id === updatedProduct._id ? updatedProduct : item,
          );

          if (updatedProduct.isProductOfDay) {
            const exists = state.productsOfDay.some(
              (item) => item._id === updatedProduct._id,
            );

            if (exists) {
              state.productsOfDay = state.productsOfDay.map((item) =>
                item._id === updatedProduct._id ? updatedProduct : item,
              );
            } else {
              state.productsOfDay.push(updatedProduct);
            }
          } else {
            state.productsOfDay = state.productsOfDay.filter(
              (item) => item._id !== updatedProduct._id,
            );
          }

          state.productById = updatedProduct; 
        } else {
          console.warn("No updated tire data received:", payload);
        }
      })

      // ⭐️ fetch []
      .addCase(fetchProductsOfDay.fulfilled, (state, action) => {
        console.log("⭐️ fetchProductsOfDay", action.payload);
        state.productsOfDay = action.payload;
      })
      // ⭐️ change
      .addCase(setProductOfDay.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        console.log("⭐️ setProductOfDay", updatedProduct);

        if (!updatedProduct) return;

        // 1. Оновлюємо товар у поточній категорії
        const categoryProduct = state.categoryResults.find(
          (product) => product._id === updatedProduct._id,
        );
        if (categoryProduct) {
          categoryProduct.isProductOfDay = updatedProduct.isProductOfDay;
        }
   
        // 2. Оновлюємо товар у результатах пошуку
        const searchProduct = state.searchResults.find(
          (product) => product._id === updatedProduct._id,
        );
        if (searchProduct) {
          searchProduct.isProductOfDay = updatedProduct.isProductOfDay;
        }

        // 3. Оновлюємо товар у вибраному за ID
        if (state.productById?._id === updatedProduct._id) {
          state.productById.isProductOfDay = updatedProduct.isProductOfDay;
        }

        // 4. Оновлюємо товар в Улюбленому
        const favoriteProduct = state.favoriteProducts.find(
          (product) => product._id === updatedProduct._id
        )
        if (favoriteProduct) {
          favoriteProduct.isProductOfDay = updatedProduct.isProductOfDay
        }
        // ----- ??? -----

        // Синхронізуємо масив товарів дня ⭐️
        if (updatedProduct.isProductOfDay) {
          //товар є у масиві productsOfDay (існує)
          const exists = state.productsOfDay.some(
            (item) => item._id === updatedProduct._id,
          );
        
          if (exists) {
            //Оновлюємо товар у масиві
            state.productsOfDay = state.productsOfDay.map((item) =>
              item._id === updatedProduct._id ? updatedProduct : item,
            );
          } else {
            //Якщо товару ще немає — додаємо його
            state.productsOfDay.push(updatedProduct);
          }
        } else {
          //Якщо зірочку прибрали — видаляємо товар із масиву
          state.productsOfDay = state.productsOfDay.filter(
            (item) => item._id !== updatedProduct._id,
          );
        }
      })

      // отримати всі можливі діаметри дисків
      .addCase(fetchRimsDiameters.fulfilled, (state, action) => {
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
