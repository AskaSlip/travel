import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Travel Planner",
  description: "Travel Planner",
};

type PropType = { children: React.ReactNode };

export default function RootLayout({children}: Readonly<PropType>) {
  return (
    <html lang="en">
      <body>
      root start
        {children}
      root end
      </body>
    </html>
  );
}
