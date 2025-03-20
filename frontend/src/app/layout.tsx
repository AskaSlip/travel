import type { Metadata } from "next";
import HeaderComponent from '@/components/Header/HeaderComponent';
import Script from 'next/script';


export const metadata: Metadata = {
  title: "Travel Planner",
  description: "Travel Planner",
};

type PropType = { children: React.ReactNode };

export default function RootLayout({children}: Readonly<PropType>) {
  return (
    <html lang="en">
    <body>
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
    />

    <HeaderComponent />
    <hr />

    {children}

    <footer>footer</footer>
    </body>
    </html>
  );
}
