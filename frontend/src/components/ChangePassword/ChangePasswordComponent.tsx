'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { passwordService } from '@/services/api.services';
import { useState } from 'react';
import { ChangePasswordFormData, changePasswordSchema } from '@/validator/validation';
import { zodResolver } from '@hookform/resolvers/zod';

const ChangePasswordComponent = () => {

  const [isSuccessChange, setIsSuccessChange] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmitChangePasswordFormHandler: SubmitHandler<ChangePasswordFormData> = async (data) => {
    if (data.newPassword !== data.password_repeat) {
      setError('root', {
        type: 'manual',
        message: 'Passwords do not match.',
      });
      return;
    }

    try {
      await passwordService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      console.log('Password change successfully');
      setIsSuccessChange(true);

    } catch (error: any) {
      console.error(error.message);
      console.log(error.message);

      if (error.message == 400) {
        console.log(400);
        setError('root', {
          type: 'manual',
          message: `Password is incorrect.`,
        });
      } else if (error.message == 409) {
        console.log(409);
        setErrorMessage('New password should be different from the old one');
        setError('root', {
          type: 'manual',
          message: 'Password should be different from the old one',
        });
      } else {
        setErrorMessage('An unknown error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>Reset Password component</h1>
      {isSuccessChange ? (<p>Password is change.</p>) :
        (
          <form onSubmit={handleSubmit(onSubmitChangePasswordFormHandler)}>
            <div>
              <input type="password"
                     placeholder="current password" {...register('currentPassword', { required: true })} />
              {errors.currentPassword && (
                <p>{errors.currentPassword.message}</p>
              )}              </div>
            <div>
              <input type="password" placeholder="new password" {...register('newPassword', { required: true })} />
              {errors.newPassword && (
                <p>{errors.newPassword.message}</p>
              )}            </div>
            <div>
              <input type="password"
                     placeholder="confirm password" {...register('password_repeat', { required: true })} />
              {errors.password_repeat && (
                <p>{errors.password_repeat.message}</p>
              )}            </div>
            {watch('password_repeat') !== watch('newPassword') && getValues('password_repeat')
              ? (<p>password not match</p>) : null
            }

            {errors.root && <p className="text-red-500">{errors.root.message}</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <button type={'submit'}>Change</button>
          </form>
        )}
    </div>
  );
};
export default ChangePasswordComponent;