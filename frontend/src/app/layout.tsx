import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SchemaFlow",
  description: "Visual Database Design Tool",
};

import { Toaster } from 'sonner';
import MobileWarning from "@/components/MobileWarning";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FeedbackWidget } from "@/components/FeedbackWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MobileWarning />
          {children}
          <FeedbackWidget />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
