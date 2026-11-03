
import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";





export const metadata: Metadata = {
  title: {
    default: "EduChild | Together We Grow",
    template: "%s | EduChild",
  },
  description:
    "Join EduChild to support children's education and create meaningful community learning opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <Suspense
  fallback={
    <div
      className="h-18 border-b border-gray-100 bg-white"
      aria-hidden="true"
    />
  }
>
  <Navbar />
</Suspense>
        {children}
          <Footer></Footer>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
