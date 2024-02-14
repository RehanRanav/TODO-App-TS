import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userData: Record<string, any> | null; // Adjust the data type as per your requirement
}

const initialState: UserState = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Record<string, any>>) => {
      state.userData = action.payload;
      localStorage.setItem("user", JSON.stringify(state.userData));
    },
    clearUser: (state) => {
      state.userData = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state: { user: UserState }) => state.user.userData;
export default userSlice.reducer;
