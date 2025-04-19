// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
//
// const RefreshTrigger = () => {
//
//   const [isTokenExpired, setIsTokenExpired] = useState<boolean>(false);
//   const router = useRouter();
//
//   useEffect(() => {
//     if (typeof window === 'undefined') return;
//
//     const expiration = localStorage.getItem('token_exp');
//     if(!expiration) return;
//
//     const now = Date.now();
//     if (now >= Number(expiration)) {
//       setIsTokenExpired(true);
//       router.push('/refresh');
//     }
//   }, []);
//
//   return null;
// };
//
// export default RefreshTrigger;