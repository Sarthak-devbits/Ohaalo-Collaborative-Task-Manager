import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IUserSliceInitalState } from "@/interfaces/IUserInterfaces";

export const initialState: IUserSliceInitalState = {
  userId: 0,
  username: "",
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IUserSliceInitalState>) => {
      const { userId, username, email } = action.payload;
      state.userId = userId;
      state.username = username;
      state.email = email;
    },
    logout: () => {
      return { ...initialState };
    },
    updateName: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const { login, logout, updateName } = userSlice.actions;

export const userData = (state: RootState) => state.user;

export default userSlice.reducer;
