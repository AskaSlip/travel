import type { Metadata } from 'next';
import HeaderComponent from '@/components/Header/HeaderComponent';
import Script from 'next/script';
import './globals.css';
import FooterComponent from '@/components/Footer/FooterComponent';
import NavigationComponent from '@/components/Navigation/NavigationComponent';

import { Providers } from '@/app/providers';
// import RefreshTrigger from '@/components/Refresh/RefreshTrigger';
export const metadata: Metadata = {
  title: 'Travel Planner',
  description: 'Travel Planner',
};

// const key= process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
type PropType = { children: React.ReactNode };
//todo fix trigger
export default function RootLayout({ children }: Readonly<PropType>) {
  return (
    <html lang="en">
    <body>
    <Providers>
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
    />
    <header>
      <HeaderComponent />
    </header>

    <div className={"container"}>
      <nav>
        <NavigationComponent />
      </nav>
      {/*<RefreshTrigger/>*/}
      <main>{children}</main>
    </div>

    <footer>
      <FooterComponent />
    </footer>
    </Providers>
    </body>

    </html>
  );
}
