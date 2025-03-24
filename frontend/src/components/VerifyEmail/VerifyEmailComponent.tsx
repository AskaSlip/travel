"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@/services/api.services';

const VerifyEmailComponent = () => {

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = params.get('token');

        if (!token) {
          throw new Error('No token found');
        }

        await authService.verifyEmail(token);
        setIsSuccess(true);

        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (error: any) {
        if (error.message === "expired") {
          setIsExpired(true);
        } else {
          setIsSuccess(false);
        }
      }
    };
    verifyEmail();
    },[params, router]);

  const handleGetNewConfirmation = async () => {
    try {
      const token = params.get('token');
      if (!token) {
        throw new Error('No token found');
      }

      let email = "";
      try{
        const decoded = JSON.parse(atob(token.split('.')[1]));
        email = decoded.email;
      }catch (error){
        throw new Error("Token is invalid");
      }

      await authService.resendConfirmation(email);
      alert("Confirmation email sent");

      setTimeout(() => {
        router.push('/');
      }, 1000);
    }catch (error:any){
      console.log(error, "Fucked up");
      alert("Fucked up with sending confirmation email. Try again");
    }
  }

  if(isExpired){
    return (
      <div>
        <p style={{ color: "red", fontWeight: "bold" }}>Посилання більше не доступне. </p>
        <button onClick={handleGetNewConfirmation}>Get new confirmation</button>
      </div>
    )
  }

    return (
      <div>
        {isSuccess  ? (
          <p>All ok. Redirecting...</p>
        ) : !isSuccess ? (
          <p style={{ color: "red" }}>Verify fucked up</p>
        ) : (
          <p>Verifying email...</p>
        )}
        </div>
    );
};

export default VerifyEmailComponent;