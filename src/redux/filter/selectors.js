export const selectTiresBySize = (state) => state.filter.tiresBySize;
export const selectRimsDiameters = (state) => state.filter.rimsDiameters;

export const selectSizePage = (state) => state.filter.sizePage;
export const selectSizeTotalPages = (state) => state.filter.sizeTotalPages;
export const selectSizeTotalItems = (state) => state.filter.sizeTotalItems;
export const selectSizePerPage = (state) => state.filter.sizePerPage;

export const selectFilterLoading = (state) => state.filter.isLoading;
