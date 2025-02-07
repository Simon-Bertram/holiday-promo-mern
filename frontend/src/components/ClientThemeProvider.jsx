"use client";

import { ThemeProvider } from "next-themes";

export default function ClientThemeProvider({ children }) {
  return (
    <ThemeProvider
      attribute="class" // Adds 'dark' class to <html> element
      defaultTheme="system" // Uses system preferences by default
      enableSystem // Allows system preference detection
      disableTransitionOnChange // Prevents flash during theme change
    >
      {children}
    </ThemeProvider>
  );
}
