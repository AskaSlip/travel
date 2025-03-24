"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SignOutComponent from '@/components/SignOut/SignOutComponent';
//todo треба змінити так, щоб при реєстрації не входило в система, а тільки показувао повідомлення про успішну реєстрацію і підтвердження по емейлу
const AuthComponent = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      setIsAuthenticated(!!accessToken);
    }

    checkAuth();

    window.addEventListener("authChanged", checkAuth);
    return () => {
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  return (
    <div>
      {isAuthenticated ?
        (<SignOutComponent/>) : (
          <div>
            <button onClick={() => router.push('/auth/sign-in')}>Login</button>
            <button onClick={() => router.push('/auth/sign-up')}>Register</button>
          </div>
        )
      }
    </div>
  )

}

export default AuthComponent;