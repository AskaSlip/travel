import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Auth",
};

type PropType = { children: React.ReactNode };

const AuthLayout = ({children}: PropType)=> {
  return (
    <div>
      {children}
    </div>
  );
};

export default AuthLayout;