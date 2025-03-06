"use client"
import { authService } from '@/services/api.services';

const SignOutComponent = () => {

  const onClickHandler = async () => {
    try {
      await authService.signOut();
      console.log('success sign out');

      if (window.google) {
        const googleAuth = window.google.accounts.id;
        if (googleAuth) {
          googleAuth.disableAutoSelect();
          googleAuth.revoke('me', () => {
            console.log('Google session revoked');
          });
        }
      }

      window.location.href = '/auth/sign-in';

    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  }

    return (
      <div>
        <button onClick={onClickHandler}>
          Sign Out
        </button>
      </div>
    )
}
export default SignOutComponent;