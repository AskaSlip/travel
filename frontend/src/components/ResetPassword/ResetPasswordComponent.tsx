"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IResetPassword } from '@/models/IResetPassword';
import { passwordService } from '@/services/api.services';
import { useState } from 'react';

const ResetPasswordComponent = () => {

  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  if(!token){
    throw new Error('No token provided')
  }

  const [isSuccessReset, setIsSuccessReset] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<IResetPassword>()

  const onSubmitResetPasswordFormHandler: SubmitHandler<IResetPassword> = async (data) => {
    try{
      await passwordService.resetPassword({ resetToken: token, password: data.password });
      console.log('Password reset successfully');

      setIsSuccessReset(true);

      setTimeout(() => {
        router.push('/auth/sign-in');
      }, 3000)
    }catch(error){
      console.error('Failed to reset password');
    }
  }

    return (
        <div>
            <h1>Reset Password component</h1>
          {isSuccessReset ? (<p>Password wa reset. Redirecting to log in....</p>) :
            (
            <form onSubmit={handleSubmit(onSubmitResetPasswordFormHandler)}>
                <input type="password" placeholder="password" {...register('password', {required: true})} />
              {errors.password?.type === 'required' && <span>This field is required</span>}
                <input type="password" placeholder="confirm password" {...register('password_repeat', {required: true})}/>
              {errors.password_repeat?.type === 'required' && <span>This field is required</span>}

              {watch('password_repeat') !== watch('password') && getValues('password_repeat')
              ? (<p>password not match</p>) : null
              }
                <button type={'submit'}>Reset</button>
              </form>
            )}
        </div>
    );
}
export default ResetPasswordComponent;