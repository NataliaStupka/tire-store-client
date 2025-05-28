export const selectAllTires = (state) => state.tire.items;
export const selectTiresByCategory = (state) => state.tire.tiresByCategory;

export const selectIsLoading = (state) => state.tire.isLoading;
export const selectIsError = (state) => state.tire.isError;
