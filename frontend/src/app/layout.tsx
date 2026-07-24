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
  title: "SchemaFlow | Visual Database Design Tool for Postgres & MongoDB",
  description: "Create, collaborate on, and export database schemas visually. SchemaFlow supports PostgreSQL, MySQL, and MongoDB with real-time collaboration.",
  keywords: [
    "SQL to ER diagram",
    "Database schema visualizer",
    "DBML editor",
    "MySQL schema generator",
    "PostgreSQL ER diagram",
    "SQL formatter",
    "JSON formatter",
    "SQL to DBML",
    "Database design tool",
    "visual database design",
    "online database modeler",
    "MySQL to ERD",
    "PostgreSQL schema designer",
    "MongoDB schema builder",
    "collaborative database modeling",
    "Mongoose schema generator",
    "export prisma schema",
    "real-time diagram collaboration",
    "ERD tool"
  ],
  authors: [{ name: "Aaditya Kumar" }],
  metadataBase: new URL("https://schemaflow.pages.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SchemaFlow | Visual Database Design Tool for Postgres & MongoDB",
    description: "Create, collaborate on, and export database schemas visually. Support for MySQL & MongoDB with team collaboration.",
    url: "https://schemaflow.pages.dev",
    siteName: "SchemaFlow",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "SchemaFlow Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SchemaFlow | Visual Database Design Tool",
    description: "Create, collaborate on, and export database schemas visually. Real-time collaboration, instant SQL/JSON export.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SchemaFlow",
  "operatingSystem": "All",
  "applicationCategory": "DeveloperApplication",
  "description": "Create, collaborate on, and export database schemas visually. SchemaFlow supports PostgreSQL, MySQL, and MongoDB with real-time collaboration.",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "USD",
    "category": "Free"
  }
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
