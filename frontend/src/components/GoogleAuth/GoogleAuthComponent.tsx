"use client"
import { authService } from '@/services/api.services';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LocalStorageTokensUpdate } from '@/helpers/localStorageTokensUpdate';

const GoogleAuthComponent = () => {

  const onClickGoogleLogInHandler = async () => {
    window.location.href = 'http://localhost:5000/auth/google/login'
  }


    return (
      <div>
          <button onClick={onClickGoogleLogInHandler}>Google log in</button>
      </div>
    )
}
export default GoogleAuthComponent;