"use client"
import { SubmitHandler, useForm } from 'react-hook-form';
import { ISignUp } from '@/models/ISignUp';
import { authService } from '@/services/api.services';
import { useEffect } from 'react';

const SignUpComponent = () => {

  const {
    handleSubmit,
    register,
    reset,
    setValue
  } = useForm<ISignUp>()

  useEffect(() => {
    setValue("username", "some name");
    setValue("email", "test@test.com");
    setValue("password", "123qwe!@#QWE");
  }, [setValue]);

  const onSubmitFormHandler: SubmitHandler<ISignUp> = async (data) => {
    try {
      const result = await authService.signUp(data);
      console.log("Success:", result);
      reset();
    } catch (error) {
      console.error("Sign-up failed:", error);
    }
  }

    return (
      <div>

        <form onSubmit={handleSubmit(onSubmitFormHandler)}>
          <input type="text" {...register('username')} placeholder={'username'} />
          <input type="email" {...register('email')} placeholder={'email'} />
          <input type="password" {...register('password')} placeholder={'password'} />

          <button type="submit">Sign Up</button>
        </form>
      </div>
    )
}
export default SignUpComponent;