import StoreProvider from "./StoreProvider";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Header from "../components/Header";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Best Holiday Promotions",
  description: "Find your dream holiday with the best deals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen bg-white dark:bg-gray-900">
              <Header />
              <main id="main-content" tabIndex="-1">
                {children}
              </main>
              <Toaster />
            </div>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
