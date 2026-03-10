import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { ScratchesOverlay } from "@/components/ScratchesOverlay";
import { getWagmiConfig } from "@/lib/wagmi.client";
import type { Metadata } from "next";
import { Bebas_Neue, Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lil-Burn",
  description: "Mint your Lil-Burn NFT. Only the worthy survive.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getWagmiConfig(),
    (await headers()).get("cookie"),
  );

  return (
    <html lang="en">
      <body
        className={`relative flex min-h-screen flex-col ${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} antialiased`}
      >
        <ScratchesOverlay />

        <Providers initialState={initialState}>
          <Header />

          {children}

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
