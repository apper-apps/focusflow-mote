import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    name: 'FocusFlow User',
    email: 'user@focusflow.app'
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;