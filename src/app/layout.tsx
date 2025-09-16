import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans-custom",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pump.fun Livestream Embed Generator",
  description: "Generate embeddable Pump.fun livestream widgets (iframe or script) and preview them locally.",
  themeColor: "#1B1C1E",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
