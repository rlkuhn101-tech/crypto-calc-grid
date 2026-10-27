import type { Metadata } from "next";

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
      <body style={{ margin: 0, padding: 0, backgroundColor: "#0f172a" }}>
        {children}
      </body>
    </html>
  );
}

