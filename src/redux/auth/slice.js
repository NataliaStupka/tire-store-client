import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { login, logout, refreshUser, register } from "./operations";

const setAuthenticatedState = (state) => {
  state.isLoggedIn = true;
  state.isRefreshing = false;
  state.isError = null;
};

const initialState = {
  user: {
    name: null,
    email: null,
    role: null,
  },
  token: null,
  isError: null,
  isLoggedIn: false, //чи залогований
  isRefreshing: false, //стан оновлення сторінки(візуал)
};

const slice = createSlice({
  name: "auth",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, { payload }) => {
        console.log("register-payload", payload);
        state.user = payload.user; // { name, email, role }
        //    state.user = {
        //      ...state.user,
        //      ...payload.data,
        //    }; //коли буде реїстрація всіх юзерів
        state.token = payload.token;
        setAuthenticatedState(state);
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        console.log("login-payload", payload);
        state.user = payload.data.user; // { name, email, role }
        //    state.user = {
        //      ...state.user,
        //      ...payload.data,
        //    };
        state.token = payload.data.accessToken;
        setAuthenticatedState(state);
      })
      //logout - повертаємо початковий стан
      .addCase(logout.fulfilled, () => {
        return initialState;
      })
      //refresh
      .addCase(refreshUser.fulfilled, (state, { payload }) => {
        state.user = { ...state.user, ...payload.user }; //???? payload
        state.token = payload.accessToken;
        setAuthenticatedState(state);
      })

      //-- addMatcher --//
      .addMatcher(
        isAnyOf(register.pending, login.pending, refreshUser.pending),
        (state) => {
          state.isRefreshing = true;
          state.isError = null;
        }
      )
      .addMatcher(
        isAnyOf(register.rejected, login.rejected, refreshUser.rejected),
        (state, { payload }) => {
          state.isLoading = false;
          state.isRefreshing = false;
          state.isError = payload;
        }
      );
  },
});

export const authReducer = slice.reducer;
