"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LocalStorageTokensUpdate } from "@/helpers/localStorageTokensUpdate";

const GoogleAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      LocalStorageTokensUpdate.updateTokens({ accessToken, refreshToken });

      router.replace("/test");
    } else {
      console.error("Google Login Error: Tokens are missing.");
      router.replace("/auth/sign-in");
    }
  }, []);

  return <p>Авторизація через Google...</p>;
};

export default GoogleAuthRedirect;
