import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto Calc Grid | Free Real-Time Crypto Conversion Hub",
  description: "Convert ten leading cryptocurrencies instantly with live CryptoCompare pricing refreshed every 30 seconds.",
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

