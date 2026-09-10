import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  AuthState,
  User,
} from "@/types/auth";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
   
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (
      state,
      action: PayloadAction<User>
    ) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    loginFailed: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

     
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logout,
 } = authSlice.actions;

export default authSlice.reducer;