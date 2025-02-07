"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

export default function ClientThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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
