"use client"
import { SubmitHandler, useForm } from 'react-hook-form';
import { authService } from '@/services/api.services';
import { ISignIn } from '@/models/ISignIn';
import { useEffect } from 'react';

const SignInComponent = () => {

  const {
    handleSubmit,
    register,
    reset,
    setValue
  } = useForm<ISignIn>()

  useEffect(() => {
    setValue("email", "test@test.com");
    setValue("password", "123qwe!@#QWE");
  }, [setValue])

  const onSubmitFormHandler: SubmitHandler<ISignIn> = async (data) => {
    try {
      const result = await authService.signIn(data);
      console.log("Success:", result);
      // reset();
    } catch (error) {
      console.error("Sign-in failed:", error);
    }
  }

    return (
      <div>

        <form onSubmit={handleSubmit(onSubmitFormHandler)}>
          <input type="email" {...register('email')} placeholder={'email'} />
          <input type="password" {...register('password')} placeholder={'password'} />

          <button type="submit">Sign In</button>
        </form>
      </div>
    )
}
export default SignInComponent;