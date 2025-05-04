import { IUser } from '@/models/IUser';
import { createSlice, isFulfilled } from '@reduxjs/toolkit';
import { loadUser } from '@/redux/redusers/user/user.extraReducers';

type userSliceType = {
  user: IUser | null;
  isAuthorized: boolean;
}

const userInitialState: userSliceType = {
  user: null,
  isAuthorized: false,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState: userInitialState,
  reducers: {
    resetUser: (state) => {
      state.user = null;
      state.isAuthorized = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addMatcher(isFulfilled(loadUser), (state, action) => {
        state.isAuthorized = true;
      })

  }
})

export const userActions = {
  ...userSlice.actions,
  loadUser
}