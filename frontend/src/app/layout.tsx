import type { Metadata } from "next";
import HeaderComponent from '@/components/Header/HeaderComponent';
import Script from 'next/script';
import './globals.css'
// import RefreshTrigger from '@/components/Refresh/RefreshTrigger';
export const metadata: Metadata = {
  title: "Travel Planner",
  description: "Travel Planner",
};

type PropType = { children: React.ReactNode };
//todo fix trigger
export default function RootLayout({children}: Readonly<PropType>) {
  return (
    <html lang="en">
    <body>

    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
    />
<header>
    <HeaderComponent />
</header>
    <hr />

    {/*<RefreshTrigger/>*/}
    <main>{children}</main>
    <footer>FOOTER</footer>

    </body>

    </html>
  );
}
