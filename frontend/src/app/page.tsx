"use client";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useEffect } from 'react';
import { userActions } from '@/redux/slices/userSlice';

export default function Home() {

  let { user } = useAppSelector(state => state.userSlice)
  let dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(userActions.loadUser())
  }, []);


  return (
    <div>
      <p>main</p>
      { user ? <p>{user.username} !!!</p> : <p>not authorized</p>}
    </div>
  );
}
