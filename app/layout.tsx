import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Michel Haussaire | Full Stack & Mobile Developer",
  description:
    "Professional portfolio of Michel Haussaire, a strategic technology leader specializing in Web, Mobile, and AI solutions for high-impact business needs.",
  keywords:
    "web developer, full stack developer, mobile app developer, React Native, Expo, AI solutions, Supabase, TypeScript, portfolio, frontend, backend, UI/UX design",
  authors: [{ name: "Michel Haussaire" }],
  openGraph: {
    title: "Michel Haussaire | Full Stack & Mobile Developer",
    description:
      "Strategic technology leader building high-impact Web, Mobile, and AI solutions",
    url: "https://hibi.dev",
    siteName: "Michel Haussaire Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Michel Haussaire - Full Stack & Mobile Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Michel Haussaire | Developer Portfolio",
    description: "Web, Mobile & AI Solutions",
    creator: "@hibidev",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://hibi.dev",
  },
  generator: "Next.js",
  metadataBase: new URL("https://hibi.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
