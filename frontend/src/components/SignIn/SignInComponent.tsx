"use client"
import { SubmitHandler, useForm } from 'react-hook-form';
import { authService } from '@/services/api.services';
import { ISignIn } from '@/models/ISignIn';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignInFormData, signInSchema } from '@/validator/validation';
import { zodResolver } from '@hookform/resolvers/zod';

const SignInComponent = () => {

  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    setError,
    setValue,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  })

  useEffect(() => {
    setValue("email", "test@test.com");
    setValue("password", "123qwe!@#QWE");
  }, [setValue])
//todo add error handling
  const onSubmitFormHandler: SubmitHandler<SignInFormData> = async (data) => {
    try {
      const result = await authService.signIn(data);
      setIsSuccess(true);
      setErrorMessage(null);
      console.log("Success:", result);

      setTimeout(() => {router.push('/')}, 2000);
    }
    catch (error: any) {
      console.error(error.message);
      console.log(error.message);

      if (error.message == 403) {
        // Handle too many failed attempts error
        console.log(403);
        setIsButtonDisabled(true);
        setErrorMessage('Too many failed attempts. Please try again later.');
      } else if (error.message == 401) {
        // Handle incorrect password/email
        console.log(401);
        setError("root", {
          type: "manual",
          message: "Password is incorrect",
        });
      }
      else if(error.message == 409){
        // Handle user not found
        console.log(409);
        setError("root", {
          type: "manual",
          message: "User with this email not registered",
        });
      }
      else {
        setErrorMessage('An unknown error occurred. Please try again.');
      }
    }
  };

    return (
      <div>
        {
          isSuccess ? (
            <p>All ok. redirect...</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmitFormHandler)}>
              <div>
                <input type="email" {...register('email')} placeholder={'email'} />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <input type="password" {...register('password')} placeholder={'password'} />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>

              {errors.root && <p className="text-red-500">{errors.root.message}</p>}
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}


              <button type="submit" disabled={isButtonDisabled}>Sign In</button>
            </form>
          )
        }
      </div>
    )
}
export default SignInComponent;