// userSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { userInitialState } from "../intialStates/userInitialState";
import { resetLoginCookie, setLoginCookie } from "@/app/actions";

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      setLoginCookie();
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    resetUser: (state) => {
      state.user = null;
      resetLoginCookie();
    },
  },
});

export const { setUser, resetUser, setAvatar } = userSlice.actions;
export const isLoggedIn = (state) => state.user.authenticated;

export default userSlice.reducer;