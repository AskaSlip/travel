"use client"
import { useRouter } from 'next/navigation';
import SignOutComponent from '@/components/SignOut/SignOutComponent';
import { useAppSelector } from '@/redux/store';
//todo треба змінити так, щоб при реєстрації не входило в система, а тільки показувао повідомлення про успішну реєстрацію і підтвердження по емейлу
const AuthComponent = () => {

  const router = useRouter()

  let { isAuthorized} = useAppSelector(state => state.userSlice)


  return (
    <div>
      {isAuthorized ?
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