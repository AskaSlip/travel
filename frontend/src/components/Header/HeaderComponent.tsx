"use client"
import Link from 'next/link';
import styles from  './Header.module.css';
import AuthComponent from '@/components/Auth/AuthComponent';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { userActions } from '@/redux/slices/userSlice';

const HeaderComponent = () => {

  let { user, isAuthorized} = useAppSelector(state => state.userSlice)
  let dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(userActions.loadUser())
  }, []);

  return(
    <div className={styles.wrap}>
      <div>
        <h1>Travel Planner</h1>
      </div>
      <div className={styles.info}>
        <span>change style</span>
        <Link href={'/my-cabinet'}>
          {isAuthorized ? (
            <img src={user?.avatar || './default-avatar.jpg'} className={styles.img} alt={"avatar"}/>
          ) : null}
        </Link>
        <AuthComponent/>
      </div>

    </div>

  )
};

export default HeaderComponent;