import StoreProvider from "./StoreProvider";
import { Geist, Geist_Mono } from "next/font/google";
import ClientThemeProvider from "@/components/ClientThemeProvider";
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white dark:bg-gray-900`}
      >
        <StoreProvider>
          <ClientThemeProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main id="main-content" className="flex-grow px-4">
                {children}
              </main>
              <Toaster />
            </div>
          </ClientThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
