import type { Metadata } from "next";
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import ErrorComponent from '@/components/Error/ErrorComponent';
import HeaderComponent from '@/components/Header/HeaderComponent';



export const metadata: Metadata = {
  title: "Travel Planner",
  description: "Travel Planner",
};
//todo error
type PropType = { children: React.ReactNode };

export default function RootLayout({children}: Readonly<PropType>) {
  return (
    <html lang="en">
    <head>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
      <title>Travel Planner</title>
    </head>
      <body>
      <HeaderComponent/>
      <hr/>
        {children}
      footer
      </body>
    </html>
  );
}
