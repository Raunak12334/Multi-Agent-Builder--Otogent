import { Provider } from "jotai";
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Quattrocento,
  Space_Grotesk,
} from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const landingSans = Space_Grotesk({
  variable: "--font-landing-sans",
  subsets: ["latin"],
});

const landingSerif = Quattrocento({
  variable: "--font-landing-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Otogent | Multi Agent System",
  description: "Infrastructure for Multi Agent System",
  icons: {
    icon: "/otogent-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${landingSans.variable} ${landingSerif.variable} antialiased`}
        suppressHydrationWarning
      >
        <TRPCReactProvider>
          <NuqsAdapter>
            <Provider>
              {children}
              <Toaster />
            </Provider>
          </NuqsAdapter>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
