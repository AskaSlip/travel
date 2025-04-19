import React from 'react';
import SignInComponent from '@/components/SignIn/SignInComponent';
import GoogleAuthComponent from '@/components/GoogleAuth/GoogleAuthComponent';
import Link from 'next/link';

const SignInPage = () => {

  return (
    <div>
      <p>sign-in</p>
      <SignInComponent/>
      <br/>
      <GoogleAuthComponent/>
      <br/>
      <Link href={"/forgot-password"}>Forgot password?</Link>
    </div>
  );

}

export default SignInPage;