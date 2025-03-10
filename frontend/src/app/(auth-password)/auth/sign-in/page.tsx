import React from 'react';
import SignInComponent from '@/components/SignIn/SignInComponent';
import GoogleAuthComponent from '@/components/GoogleAuth/GoogleAuthComponent';

const SignInPage = () => {

  return (
    <div>
      <p>sign-in</p>
      <SignInComponent/>
      <br/>
      <GoogleAuthComponent/>
    </div>
  );

}

export default SignInPage;