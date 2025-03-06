"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SignOutComponent from '@/components/SignOut/SignOutComponent';

const AuthComponent = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken);
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