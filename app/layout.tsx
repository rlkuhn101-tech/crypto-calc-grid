import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crypto Calc Grid | Free Real-Time Crypto Conversion Hub",
  description: "Convert bitcoin, ethereum, and the top 100 cryptocurrencies instantly. Free real-time interactive multi-asset swap calculator grid.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
