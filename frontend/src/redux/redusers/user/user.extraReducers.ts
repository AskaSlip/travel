import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@/services/api.services';

export const loadUser = createAsyncThunk(
  'userSlice/loadUser',
  async (_, thunkAPI) => {
    try {
      let response = await userService.getCurrentUser()
      return thunkAPI.fulfillWithValue(response)
    }catch(e){
      return thunkAPI.rejectWithValue('Error while loading user')
    }
  }
)