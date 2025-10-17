export const selectAllTires = (state) => state.tire.items;
export const selectTiresByCategory = (state) => state.tire.tiresByCategory;
// export const selectTireById = (state) => state.tire.tireById?.tire || null;
export const selectTireById = (state) => state.tire.tireById;
export const selectFavoriteTires = (state) => state.tire.favoriteTires;

export const selectIsLoading = (state) => state.tire.isLoading;
export const selectIsError = (state) => state.tire.isError;
