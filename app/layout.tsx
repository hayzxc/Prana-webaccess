import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/simple-backend-auth";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PT Prana Argentum - Certification Portal",
  description: "Professional fumigation and certification services",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className={inter.className}>
        <AuthProvider>
          <NextTopLoader
            color="#084AF3"
            initialPosition={0.08}
            crawlSpeed={200}
            height={5}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
          />
          <ErrorBoundary>{children}</ErrorBoundary>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
