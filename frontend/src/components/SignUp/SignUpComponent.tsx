"use client"
import { SubmitHandler, useForm } from 'react-hook-form';
import { authService } from '@/services/api.services';
import { useEffect, useState } from 'react';
import { SignUpFormData, sighUpSchema } from '@/validator/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

const SignUpComponent = () => {

  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(sighUpSchema)
  })

  useEffect(() => {
    setValue("username", "some name");
    setValue("email", "test@test.com");
    setValue("password", "123qwe!@#QWE");
  }, [setValue]);

  const onSubmitFormHandler: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      const result = await authService.signUp(data);
      console.log("Success:", result);
      setIsSuccess(true);

      //todo later change redirect
      setTimeout(() => {router.push('/test')}, 3000);


    } catch (error) {
      console.error("Sign-up failed:", error);
    }
  }

    return (
      <div>
        {
          isSuccess ? (
            <p>All good. Redirect...</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmitFormHandler)}>
              <div>
                <input type="text" {...register('username')} placeholder={'username'} />
                {errors.username && <p className="text-red-500">{errors.username.message}</p>}
              </div>
              <div>
                <input type="email" {...register('email')} placeholder={'email'} />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <input type="password" {...register('password')} placeholder={'password'} />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>

              <button type="submit">Sign Up</button>
            </form>
          )
        }
      </div>
    )
}
export default SignUpComponent;