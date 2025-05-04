import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { userSlice } from '@/redux/slices/userSlice';

export let store = configureStore({
  reducer: {
    userSlice: userSlice.reducer
  }
})

export const useAppSelector = useSelector.withTypes<ReturnType<typeof store.getState>>();
export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>();