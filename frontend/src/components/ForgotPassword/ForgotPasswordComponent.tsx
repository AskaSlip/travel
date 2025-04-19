"use client"
import { SubmitHandler, useForm } from 'react-hook-form';
import { passwordService } from '@/services/api.services';
import React from 'react';
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/validator/validation';
import { zodResolver } from '@hookform/resolvers/zod';

const ForgotPasswordComponent = () => {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSendEmailHandler: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      await passwordService.forgotPassword(data)
      console.log('Success send email');
    }catch(error:any) {
      console.error('Failed to send email');
      if(error.message == 409){
        setError('email', {
          type: 'manual',
          message: 'User with this email does not exist'
        })
      }
    }
  }

  return (
    <div>
      <h1>forgot page</h1>
      <form onSubmit={handleSubmit(onSendEmailHandler)}>
        <input type={'email'} placeholder={'email@example.com'} {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
        <button type={'submit'}>Send email</button>
      </form>
    </div>
  );
};

export default ForgotPasswordComponent