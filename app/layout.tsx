import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Haussaire Michel",
  description: "Portfolioi web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <header>
          <Navbar/>
        </header>
        <main>
          {children}
        </main>
        <footer>
          <Footer/>
        </footer>
      </Providers>
    </html>
  );
}