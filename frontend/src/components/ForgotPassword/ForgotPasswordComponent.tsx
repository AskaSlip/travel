"use client"
import { SubmitHandler, useForm } from 'react-hook-form';
import { passwordService } from '@/services/api.services';
import React from 'react';
import { IEmail } from '@/models/IEmail';

const ForgotPasswordComponent = () => {
  const {
    handleSubmit,
    register,
  } = useForm<IEmail>()

  const onSendEmailHandler: SubmitHandler<IEmail> = async (data) => {
    try {
      await passwordService.forgotPassword(data)
      console.log('Success send email');
    }catch(err) {
      console.error('Failed to send email');
    }
  }

  return (
    <div>
      <h1>forgot page</h1>
      <form onSubmit={handleSubmit(onSendEmailHandler)}>
        <input type={'email'} placeholder={'email@example.com'} {...register('email')} />
        <button type={'submit'}>Send email</button>
      </form>
    </div>
  );
};

export default ForgotPasswordComponent