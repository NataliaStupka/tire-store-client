export const selectSearchResults = (state) => state.catalog.searchResults;
export const selectCategoryResults = (state) => state.catalog.categoryResults;

// export const selectProductById = (state) => state.catalog.productById?.tire || null;
export const selectProductById = (state) => state.catalog.productById;
export const selectFavoriteProducts = (state) => state.catalog.favoriteProducts;

export const selectRimsDiameters = (state) => state.catalog.rimsDiameters;

export const selectCurrentPage = (state) => state.catalog.currentPage;
export const selectTotalPages = (state) => state.catalog.totalPages;

export const selectIsLoading = (state) => state.catalog.isLoading;
export const selectIsError = (state) => state.catalog.error;
