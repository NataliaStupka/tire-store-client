export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectUserRole = (state) => state.auth.user.role;
// export const selectUserRole = (state) => state.auth.user?.role || null;
//refresh
export const selectIsRefreshing = (state) => state.auth.isRefreshing;

// export const selectIsError
// export const selectIsLoading
